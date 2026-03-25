import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { GetVisitsQueryDto } from './dto/get-visits-query.dto';

// import puppeteer from 'puppeteer';
import puppeteer, { Browser } from 'puppeteer-core';
import chromium from 'chromium';

@Injectable()
export class BillingService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser | null = null;
  constructor(private prisma: PrismaService) {}
  async onModuleInit() {
    // Launch the browser once when the application starts
    const isProd = process.env.NODE_ENV === 'production';

    try {
      this.browser = await puppeteer.launch(
        isProd
          ? {
              executablePath: await chromium.executablePath(),
              args: chromium.args,
              headless: chromium.headless,
            }
          : {
              headless: true,
              channel: 'chrome',
              // Tip: You might need to specify executablePath locally for puppeteer-core
              // depending on your OS, e.g., executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            },
      );
      console.log('Puppeteer browser launched successfully.');
    } catch (error) {
      console.error('Failed to launch Puppeteer browser:', error);
    }
  }

  async onModuleDestroy() {
    // Clean up the browser instance when the app shuts down
    if (this.browser) {
      await this.browser.close();
      console.log('Puppeteer browser closed.');
    }
  }

  // ─── SEARCH OPD VISITS FOR BILLING ─────────────────────────────
  async searchVisits(hospitalId: number, query: GetVisitsQueryDto) {
    const where: any = {
      hospital_id: hospitalId,
      is_active: true,

      queue_tokens: {
        some: {
          status: 'Completed',
        },
      },
    };

    if (query.search) {
      where.OR = [
        { opd_no: { contains: query.search, mode: 'insensitive' } },
        {
          patients: {
            full_name: { contains: query.search, mode: 'insensitive' },
          },
        },
        {
          patients: {
            patient_no: { contains: query.search, mode: 'insensitive' },
          },
        },
      ];
    }

    const visits = await this.prisma.opd_visits.findMany({
      where,
      include: {
        patients: {
          include: {
            patient_contact_details: true,
          },
        },
        doctors: {
          include: {
            users_doctors_user_idTousers: true,
            departments_master: true,
          },
        },
        billing: {
          where: { is_active: true },
          select: { bill_id: true, billing_status: true },
        },
        opd_tests: true,
        opd_procedures: true,
        prescriptions: {
          where: { is_active: true },
          include: { prescription_items: true },
        },
        opd_diagnoses: true,
      },
      orderBy: { visit_datetime: 'desc' },
      take: 20,
    });

    let filteredVisits = visits;
    if (query.status === 'Pending Bill') {
      filteredVisits = visits.filter((v) => v.billing.length === 0);
    } else if (query.status === 'Billed') {
      filteredVisits = visits.filter((v) => v.billing.length > 0);
    }

    return {
      data: filteredVisits.map((v) => {
        const hasBill = v.billing.length > 0;
        const dob = v.patients.dob;
        const age = Math.floor(
          (Date.now() - new Date(dob).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        );

        return {
          opdId: v.opd_id,
          opdNo: v.opd_no,
          patientId: v.patients.patient_no,
          patientName: v.patients.full_name,
          age,
          gender: v.patients.gender,
          phone: v.patients.patient_contact_details?.phone_number || '-',
          doctorId: v.doctor_id,
          doctorName: v.doctors.users_doctors_user_idTousers.full_name,
          department: v.doctors.departments_master.department_name,
          visitDate: new Date(v.visit_datetime).toISOString().split('T')[0],
          chiefComplaint: v.chief_complaint,
          indicators: {
            diagnosisAdded: v.opd_diagnoses.length > 0,
            testsOrdered: v.opd_tests.length > 0,
            proceduresDone: v.opd_procedures.length > 0,
            prescriptionGenerated: v.prescriptions.length > 0,
          },
          status: hasBill ? 'Billed' : 'Pending Bill',
          billId: hasBill ? v.billing[0].bill_id : null,
        };
      }),
    };
  }

  // ─── GET VISIT DETAILS WITH AUTO-COLLECTED BILLABLE ITEMS ──────
  async getVisitDetails(hospitalId: number, visitId: number) {
    const visit = await this.prisma.opd_visits.findFirst({
      where: { opd_id: visitId, hospital_id: hospitalId },
      include: {
        patients: {
          include: { patient_contact_details: true },
        },
        doctors: {
          include: {
            users_doctors_user_idTousers: true,
            departments_master: true,
          },
        },
        opd_tests: {
          include: {
            tests: {
              include: {
                hospital_tests: {
                  where: { hospital_id: hospitalId, is_active: true },
                },
              },
            },
          },
        },
        opd_procedures: {
          include: {
            procedures: {
              include: {
                hospital_procedures: {
                  where: { hospital_id: hospitalId, is_active: true },
                },
              },
            },
          },
        },
        prescriptions: {
          where: { is_active: true },
          include: {
            prescription_items: {
              include: {
                medicines: {
                  include: {
                    hospital_medicines: {
                      where: { hospital_id: hospitalId, is_active: true },
                    },
                  },
                },
              },
            },
          },
        },
        opd_diagnoses: true,
        billing: {
          where: { is_active: true },
          include: {
            bill_items: true,
            payments: {
              where: { is_active: true },
              include: { payment_modes: true },
            },
          },
        },
      },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    // If already billed, return existing bill data
    if (visit.billing.length > 0) {
      const bill = visit.billing[0];
      const dob = visit.patients.dob;
      const age = Math.floor(
        (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      );

      return {
        data: {
          visit: {
            opdId: visit.opd_id,
            opdNo: visit.opd_no,
            patientId: visit.patients.patient_no,
            patientName: visit.patients.full_name,
            age,
            gender: visit.patients.gender,
            phone: visit.patients.patient_contact_details?.phone_number || '-',
            doctorId: visit.doctor_id,
            doctorName: visit.doctors.users_doctors_user_idTousers.full_name,
            department: visit.doctors.departments_master.department_name,
            visitDate: new Date(visit.visit_datetime)
              .toISOString()
              .split('T')[0],
            chiefComplaint: visit.chief_complaint,
            indicators: {
              diagnosisAdded: visit.opd_diagnoses.length > 0,
              testsOrdered: visit.opd_tests.length > 0,
              proceduresDone: visit.opd_procedures.length > 0,
              prescriptionGenerated: visit.prescriptions.length > 0,
            },
          },
          existingBill: {
            billId: bill.bill_id,
            billNumber: bill.bill_number,
            billDate: bill.bill_date,
            billingStatus: bill.billing_status,
            paymentStatus: bill.payment_status,
            subtotalAmount: Number(bill.subtotal_amount),
            taxAmount: Number(bill.tax_amount),
            discountAmount: Number(bill.discount_amount),
            totalAmount: Number(bill.total_amount),
            billItems: bill.bill_items.map((bi) => ({
              billItemId: bi.bill_item_id,
              itemType: bi.item_type,
              referenceId: bi.reference_id,
              itemDescription: bi.item_description,
              quantity: bi.quantity,
              unitPrice: Number(bi.unit_price),
              totalPrice: Number(bi.total_price),
            })),
            payments: bill.payments.map((p) => ({
              paymentId: p.payment_id,
              paymentDate: p.payment_date,
              amountPaid: Number(p.amount_paid),
              paymentMode: p.payment_modes.payment_mode_name,
              paymentModeId: p.payment_mode_id,
              referenceNumber: p.reference_number || '-',
              paymentStatus: p.payment_status,
            })),
          },
        },
      };
    }

    // Auto-collect billable items from visit data
    const serviceItems: any[] = [];
    const medicineItems: any[] = [];

    // 1. Consultation fee
    const consultFee = Number(visit.doctors.consultation_fees);
    if (consultFee > 0) {
      serviceItems.push({
        itemType: 'Consultation',
        referenceId: visit.doctor_id,
        itemDescription: `${visit.doctors.departments_master.department_name} Consultation - ${visit.doctors.users_doctors_user_idTousers.full_name}`,
        quantity: 1,
        unitPrice: consultFee,
      });
    }

    // 2. Tests
    for (const ot of visit.opd_tests) {
      const price =
        ot.tests.hospital_tests.length > 0
          ? Number(ot.tests.hospital_tests[0].price)
          : 0;
      serviceItems.push({
        itemType: 'Test',
        referenceId: ot.opd_test_id,
        itemDescription: `${ot.tests.test_name} (${ot.tests.test_code})`,
        quantity: 1,
        unitPrice: price,
      });
    }

    // 3. Procedures
    for (const op of visit.opd_procedures) {
      const price =
        op.procedures.hospital_procedures.length > 0
          ? Number(op.procedures.hospital_procedures[0].price)
          : 0;
      serviceItems.push({
        itemType: 'Procedure',
        referenceId: op.opd_procedure_id,
        itemDescription: `${op.procedures.procedure_name} (${op.procedures.procedure_code})`,
        quantity: 1,
        unitPrice: price,
      });
    }

    // 4. Medicines from prescriptions
    for (const rx of visit.prescriptions) {
      for (const pi of rx.prescription_items) {
        const price =
          pi.medicines.hospital_medicines.length > 0
            ? Number(pi.medicines.hospital_medicines[0].price)
            : 0;
        medicineItems.push({
          itemType: 'Medicine',
          referenceId: pi.prescription_item_id,
          itemDescription: pi.medicines.medicine_name,
          medicineCode: pi.medicines.medicine_code,
          medicineType: pi.medicines.medicine_type,
          strength: pi.medicines.strength,
          manufacturer: pi.medicines.manufacturer || '-',
          dosage: pi.dosage,
          durationDays: pi.duration_days,
          quantity: pi.quantity,
          unitPrice: price,
        });
      }
    }

    const dob = visit.patients.dob;
    const age = Math.floor(
      (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    );

    return {
      data: {
        visit: {
          opdId: visit.opd_id,
          opdNo: visit.opd_no,
          patientId: visit.patients.patient_no,
          patientName: visit.patients.full_name,
          age,
          gender: visit.patients.gender,
          phone: visit.patients.patient_contact_details?.phone_number || '-',
          doctorId: visit.doctor_id,
          doctorName: visit.doctors.users_doctors_user_idTousers.full_name,
          department: visit.doctors.departments_master.department_name,
          visitDate: new Date(visit.visit_datetime).toISOString().split('T')[0],
          chiefComplaint: visit.chief_complaint,
          indicators: {
            diagnosisAdded: visit.opd_diagnoses.length > 0,
            testsOrdered: visit.opd_tests.length > 0,
            proceduresDone: visit.opd_procedures.length > 0,
            prescriptionGenerated: visit.prescriptions.length > 0,
          },
        },
        existingBill: null,
        serviceItems,
        medicineItems,
      },
    };
  }

  // ─── CREATE BILL ───────────────────────────────────────────────
  async createBill(hospitalId: number, dto: CreateBillDto, userId: number) {
    // Validate visit exists
    const visit = await this.prisma.opd_visits.findFirst({
      where: { opd_id: dto.visit_id, hospital_id: hospitalId },
    });

    if (!visit) {
      throw new NotFoundException('OPD visit not found');
    }

    // Check no active bill exists for this visit
    const existingBill = await this.prisma.billing.findFirst({
      where: { visit_id: dto.visit_id, is_active: true },
    });

    if (existingBill) {
      throw new BadRequestException(
        'A bill already exists for this visit. Please modify the existing bill instead.',
      );
    }

    // Generate bill number: RCPT-{hospital_code}-YYYYMM-XXXXX
    const hospital = await this.prisma.hospitals.findUnique({
      where: { hospital_id: hospitalId },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const billNumber = await this.generateBillNumber(
      hospitalId,
      hospital.hospital_code,
      userId,
    );

    // Calculate amounts
    const subtotal = dto.bill_items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
    const totalAmount = subtotal + dto.tax_amount - dto.discount_amount;

    // Determine payment status
    let paymentStatus = 'Pending';
    if (dto.payment_amount && dto.payment_amount >= totalAmount) {
      paymentStatus = 'Paid';
    } else if (dto.payment_amount && dto.payment_amount > 0) {
      paymentStatus = 'Partially Paid';
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create billing record
      const bill = await tx.billing.create({
        data: {
          hospital_id: hospitalId,
          visit_id: dto.visit_id,
          bill_number: billNumber,
          subtotal_amount: parseFloat(subtotal.toFixed(2)),
          tax_amount: parseFloat(dto.tax_amount.toFixed(2)),
          discount_amount: parseFloat(dto.discount_amount.toFixed(2)),
          total_amount: parseFloat(totalAmount.toFixed(2)),
          payment_status: paymentStatus,
          billing_status: 'Draft',
          created_by: userId,
          modified_by: userId,
        },
      });

      // 2. Create bill items
      for (const item of dto.bill_items) {
        await tx.bill_items.create({
          data: {
            bill_id: bill.bill_id,
            item_type: item.item_type,
            reference_id: item.reference_id || null,
            item_description: item.item_description,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price.toFixed(2)),
            total_price: parseFloat(
              (item.quantity * item.unit_price).toFixed(2),
            ),
          },
        });
      }

      // 3. Create initial payment if provided
      if (dto.payment_amount && dto.payment_mode_id) {
        await tx.payments.create({
          data: {
            bill_id: bill.bill_id,
            payment_mode_id: dto.payment_mode_id,
            amount_paid: parseFloat(dto.payment_amount.toFixed(2)),
            reference_number: dto.payment_reference || null,
            payment_status: 'Success',
            received_by: userId,
            created_by: userId,
            modified_by: userId,
          },
        });
      }

      return {
        message: 'Bill created successfully',
        data: {
          billId: bill.bill_id,
          billNumber: bill.bill_number,
        },
      };
    });
  }

  // ─── FINALIZE BILL ─────────────────────────────────────────────
  async finalizeBill(hospitalId: number, billId: number, userId: number) {
    const bill = await this.prisma.billing.findFirst({
      where: { bill_id: billId, hospital_id: hospitalId, is_active: true },
      include: {
        payments: { where: { is_active: true, payment_status: 'Success' } },
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (bill.billing_status === 'Finalized') {
      throw new BadRequestException('Bill is already finalized');
    }

    // Recalculate payment status
    const totalPaid = bill.payments.reduce(
      (sum, p) => sum + Number(p.amount_paid),
      0,
    );
    const totalAmount = Number(bill.total_amount);

    let paymentStatus = 'Pending';
    if (totalPaid >= totalAmount) {
      paymentStatus = 'Paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'Partially Paid';
    }

    await this.prisma.billing.update({
      where: { bill_id: billId },
      data: {
        billing_status: 'Finalized',
        payment_status: paymentStatus,
        modified_by: userId,
        modified_at: new Date(),
      },
    });

    return {
      message: 'Bill finalized successfully',
      data: { billId, paymentStatus },
    };
  }

  // ─── GET BILL ──────────────────────────────────────────────────
  async getBill(hospitalId: number, billId: number) {
    const bill = await this.prisma.billing.findFirst({
      where: { bill_id: billId, hospital_id: hospitalId, is_active: true },
      include: {
        bill_items: { orderBy: { bill_item_id: 'asc' } },
        payments: {
          where: { is_active: true },
          include: {
            payment_modes: true,
            users_payments_received_byTousers: true,
          },
          orderBy: { payment_date: 'asc' },
        },
        opd_visits: {
          include: {
            patients: { include: { patient_contact_details: true } },
            doctors: {
              include: {
                users_doctors_user_idTousers: true,
                departments_master: true,
              },
            },
          },
        },
        hospitals: true,
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    const visit = bill.opd_visits;
    const dob = visit.patients.dob;
    const age = Math.floor(
      (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    );

    return {
      data: {
        bill: {
          billId: bill.bill_id,
          billNumber: bill.bill_number,
          billDate: bill.bill_date,
          billingStatus: bill.billing_status,
          paymentStatus: bill.payment_status,
          subtotalAmount: Number(bill.subtotal_amount),
          taxAmount: Number(bill.tax_amount),
          discountAmount: Number(bill.discount_amount),
          totalAmount: Number(bill.total_amount),
        },
        visit: {
          opdId: visit.opd_id,
          opdNo: visit.opd_no,
          patientId: visit.patients.patient_no,
          patientName: visit.patients.full_name,
          age,
          gender: visit.patients.gender,
          phone: visit.patients.patient_contact_details?.phone_number || '-',
          doctorName: visit.doctors.users_doctors_user_idTousers.full_name,
          department: visit.doctors.departments_master.department_name,
          visitDate: new Date(visit.visit_datetime).toISOString().split('T')[0],
          chiefComplaint: visit.chief_complaint,
        },
        billItems: bill.bill_items.map((bi) => ({
          billItemId: bi.bill_item_id,
          itemType: bi.item_type,
          referenceId: bi.reference_id,
          itemDescription: bi.item_description,
          quantity: bi.quantity,
          unitPrice: Number(bi.unit_price),
          totalPrice: Number(bi.total_price),
        })),
        payments: bill.payments.map((p) => ({
          paymentId: p.payment_id,
          paymentDate: p.payment_date,
          amountPaid: Number(p.amount_paid),
          paymentMode: p.payment_modes.payment_mode_name,
          paymentModeId: p.payment_mode_id,
          referenceNumber: p.reference_number || '-',
          paymentStatus: p.payment_status,
          receivedBy: p.users_payments_received_byTousers.full_name,
        })),
        hospital: {
          name: bill.hospitals.hospital_name,
          code: bill.hospitals.hospital_code,
          address: bill.hospitals.address,
          phone:
            bill.hospitals.contact_phone || bill.hospitals.receptionist_contact,
          email: bill.hospitals.contact_email || '-',
          registrationNo: bill.hospitals.registration_no || '-',
          gstNo: bill.hospitals.gst_no || '-',
        },
      },
    };
  }

  // ─── GET BILL BY VISIT ─────────────────────────────────────────
  async getBillByVisit(hospitalId: number, visitId: number) {
    const bill = await this.prisma.billing.findFirst({
      where: { visit_id: visitId, hospital_id: hospitalId, is_active: true },
    });

    if (!bill) {
      throw new NotFoundException('No bill found for this visit');
    }

    return this.getBill(hospitalId, bill.bill_id);
  }

  // ─── GET BILL PRINT DATA ──────────────────────────────────────
  async getBillPrintData(hospitalId: number, billId: number) {
    return this.getBill(hospitalId, billId);
  }

  // ─── GENERATE BILL PDF ────────────────────────────────────────
  async generateBillPdf(hospitalId: number, billId: number): Promise<Buffer> {
    const result = await this.getBillPrintData(hospitalId, billId);
    const data = result.data;

    const serviceItems = data.billItems.filter(
      (i) => i.itemType !== 'Medicine',
    );
    const medicineItems = data.billItems.filter(
      (i) => i.itemType === 'Medicine',
    );

    const html = this.buildBillHtml(data, serviceItems, medicineItems);

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });
    // Ensure the browser is running
    if (!this.browser) {
      throw new Error('PDF Generator is not properly initialized.');
    }
    let page;
    try {
      page = await this.browser.newPage();
      // await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
      });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
      });
      return Buffer.from(pdf);
    } catch (err) {
      console.error('PDF ERROR:', err);
      throw err;
    } finally {
      // await this.browser.close();
      if (page) {
        await page.close();
      }
    }
  }

  // ─── HELPERS ───────────────────────────────────────────────────
  private async generateBillNumber(
    hospitalId: number,
    hospitalCode: string,
    userId: number,
  ): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get or create counter
    let counter = await this.prisma.hospital_counters.findFirst({
      where: { hospital_id: hospitalId, counter_type: 'BILLING' },
    });

    if (!counter) {
      counter = await this.prisma.hospital_counters.create({
        data: {
          hospital_id: hospitalId,
          counter_type: 'BILLING',
          prefix: 'RCPT',
          current_value: 0,
          reset_policy: 'Monthly',
          last_reset_date: now,
          created_by: userId,
          modified_by: userId,
        },
      });
    }

    // Check if monthly reset needed
    const lastReset = counter.last_reset_date;
    if (
      lastReset &&
      (lastReset.getMonth() !== now.getMonth() ||
        lastReset.getFullYear() !== now.getFullYear())
    ) {
      await this.prisma.hospital_counters.update({
        where: { counter_id: counter.counter_id },
        data: {
          current_value: 0,
          last_reset_date: now,
          modified_by: userId,
        },
      });
      counter.current_value = 0;
    }

    // Increment counter
    const newValue = counter.current_value + 1;
    await this.prisma.hospital_counters.update({
      where: { counter_id: counter.counter_id },
      data: {
        current_value: newValue,
        modified_by: userId,
      },
    });

    const serial = String(newValue).padStart(5, '0');
    return `RCPT-${hospitalCode}-${yearMonth}-${serial}`;
  }

  private buildBillHtml(
    data: any,
    serviceItems: any[],
    medicineItems: any[],
  ): string {
    const totalPaid = data.payments.reduce(
      (s: number, p: any) => s + p.amountPaid,
      0,
    );
    const balance = data.bill.totalAmount - totalPaid;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a2e; font-size: 12px; line-height: 1.5; }
    .container { max-width: 780px; margin: 0 auto; padding: 20px; }

    /* Header */
    .header { text-align: center; border-bottom: 3px solid #0f766e; padding-bottom: 15px; margin-bottom: 20px; }
    .hospital-name { font-size: 22px; font-weight: 800; color: #0f766e; letter-spacing: 1px; }
    .hospital-sub { font-size: 10px; color: #555; margin-top: 4px; }
    .bill-title { font-size: 15px; font-weight: 700; color: #0f766e; margin-top: 12px; letter-spacing: 2px; text-transform: uppercase; border: 2px solid #0f766e; display: inline-block; padding: 4px 20px; }

    /* Info grid */
    .info-grid { display: flex; justify-content: space-between; margin-bottom: 16px; gap: 20px; }
    .info-box { flex: 1; background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 6px; padding: 10px 14px; }
    .info-box h4 { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #0f766e; font-weight: 700; margin-bottom: 6px; }
    .info-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px; }
    .info-label { color: #666; }
    .info-value { font-weight: 600; color: #1a1a2e; }

    /* Tables */
    .section-title { font-size: 13px; font-weight: 700; color: #0f766e; margin: 18px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #99f6e4; display: flex; align-items: center; gap: 6px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th { background: #0f766e; color: white; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; }
    th:last-child, td:last-child { text-align: right; }
    td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
    tr:nth-child(even) { background: #f9fafb; }

    /* Medicine section */
    .medicine-section { background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 14px; margin: 16px 0; }
    .medicine-section .section-title { color: #a16207; border-bottom-color: #fef08a; margin-top: 0; }
    .medicine-section th { background: #a16207; }
    .medicine-section tr:nth-child(even) { background: #fefce8; }

    /* Summary */
    .summary-grid { display: flex; justify-content: flex-end; margin: 16px 0; }
    .summary-box { width: 280px; }
    .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 11px; border-bottom: 1px dashed #e5e7eb; }
    .summary-row.total { border-top: 2px solid #0f766e; border-bottom: none; padding-top: 8px; margin-top: 4px; font-size: 14px; font-weight: 800; color: #0f766e; }
    .summary-label { color: #555; }
    .summary-value { font-weight: 600; }

    /* Payment table */
    .payment-section { margin-top: 12px; }

    /* Status badges */
    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-paid { background: #dcfce7; color: #166534; }
    .badge-partial { background: #fef3c7; color: #92400e; }
    .badge-pending { background: #fee2e2; color: #991b1b; }

    /* Footer */
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 9px; color: #888; }
    .stamp-area { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 10px; }
    .stamp-box { text-align: center; font-size: 10px; color: #555; border-top: 1px solid #999; padding-top: 5px; min-width: 150px; }

    /* =========================================
       CRITICAL PRINT PAGINATION FIXES
       ========================================= */
    @media print {
      /* Force table headers to repeat on every new page */
      thead { display: table-header-group; }
      
      /* Prevent table rows from being split in half */
      tr { page-break-inside: avoid; break-inside: avoid; }
      
      /* Prevent crucial sections from breaking awkwardly across pages */
      .info-grid, 
      .summary-grid, 
      .stamp-area, 
      .medicine-section, 
      .payment-section { 
        page-break-inside: avoid; 
        break-inside: avoid; 
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="hospital-name">${data.hospital.name}</div>
      <div class="hospital-sub">${data.hospital.address}</div>
      <div class="hospital-sub">Phone: ${data.hospital.phone} | Email: ${data.hospital.email}</div>
      ${data.hospital.registrationNo !== '-' ? `<div class="hospital-sub">Reg. No: ${data.hospital.registrationNo} ${data.hospital.gstNo !== '-' ? `| GST: ${data.hospital.gstNo}` : ''}</div>` : ''}
      <div class="bill-title">Tax Invoice / Receipt</div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h4>Patient Details</h4>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${data.visit.patientName}</span></div>
        <div class="info-row"><span class="info-label">ID</span><span class="info-value">${data.visit.patientId}</span></div>
        <div class="info-row"><span class="info-label">Age / Gender</span><span class="info-value">${data.visit.age}Y, ${data.visit.gender}</span></div>
        <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${data.visit.phone}</span></div>
      </div>
      <div class="info-box">
        <h4>Bill Details</h4>
        <div class="info-row"><span class="info-label">Bill No.</span><span class="info-value">${data.bill.billNumber}</span></div>
        <div class="info-row"><span class="info-label">Bill Date</span><span class="info-value">${new Date(data.bill.billDate).toLocaleDateString('en-IN')}</span></div>
        <div class="info-row"><span class="info-label">OPD No.</span><span class="info-value">${data.visit.opdNo}</span></div>
        <div class="info-row"><span class="info-label">Doctor</span><span class="info-value">${data.visit.doctorName}</span></div>
      </div>
    </div>

    ${
      serviceItems.length > 0
        ? `
    <div class="section-title">⚕ Service & Procedure Charges</div>
    <table>
      <thead><tr><th>#</th><th>Type</th><th>Description</th><th>Qty</th><th>Unit Price (₹)</th><th>Total (₹)</th></tr></thead>
      <tbody>
        ${serviceItems.map((item, i) => `<tr><td>${i + 1}</td><td>${item.itemType}</td><td>${item.itemDescription}</td><td>${item.quantity}</td><td>${Number(item.unitPrice).toFixed(2)}</td><td>${Number(item.totalPrice).toFixed(2)}</td></tr>`).join('')}
      </tbody>
    </table>
    `
        : ''
    }

    ${
      medicineItems.length > 0
        ? `
    <div class="medicine-section">
      <div class="section-title">💊 Prescription & Medicines</div>
      <table>
        <thead><tr><th>#</th><th>Medicine</th><th>Description</th><th>Qty</th><th>Unit Price (₹)</th><th>Total (₹)</th></tr></thead>
        <tbody>
          ${medicineItems.map((item, i) => `<tr><td>${i + 1}</td><td>${item.itemDescription}</td><td>Prescribed Medicine</td><td>${item.quantity}</td><td>${Number(item.unitPrice).toFixed(2)}</td><td>${Number(item.totalPrice).toFixed(2)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    `
        : ''
    }

    <div class="summary-grid">
      <div class="summary-box">
        <div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-value">₹${data.bill.subtotalAmount.toFixed(2)}</span></div>
        <div class="summary-row"><span class="summary-label">Tax</span><span class="summary-value">₹${data.bill.taxAmount.toFixed(2)}</span></div>
        <div class="summary-row"><span class="summary-label">Discount</span><span class="summary-value" style="color:#16a34a">- ₹${data.bill.discountAmount.toFixed(2)}</span></div>
        <div class="summary-row total"><span>Grand Total</span><span>₹${data.bill.totalAmount.toFixed(2)}</span></div>
        <div class="summary-row"><span class="summary-label">Amount Paid</span><span class="summary-value" style="color:#16a34a">₹${totalPaid.toFixed(2)}</span></div>
        <div class="summary-row"><span class="summary-label">Balance Due</span><span class="summary-value" style="color:${balance > 0 ? '#dc2626' : '#16a34a'}">₹${balance.toFixed(2)}</span></div>
      </div>
    </div>

    ${
      data.payments.length > 0
        ? `
    <div class="payment-section">
      <div class="section-title">💳 Payment History</div>
      <table>
        <thead><tr><th>#</th><th>Date</th><th>Mode</th><th>Reference</th><th>Status</th><th>Amount (₹)</th></tr></thead>
        <tbody>
          ${data.payments.map((p: any, i: number) => `<tr><td>${i + 1}</td><td>${new Date(p.paymentDate).toLocaleDateString('en-IN')}</td><td>${p.paymentMode}</td><td>${p.referenceNumber}</td><td><span class="badge ${p.paymentStatus === 'Success' ? 'badge-paid' : p.paymentStatus === 'Pending' ? 'badge-pending' : 'badge-partial'}">${p.paymentStatus}</span></td><td>₹${p.amountPaid.toFixed(2)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    `
        : ''
    }

    <div class="stamp-area">
      <div class="stamp-box">Patient / Attendant Signature</div>
      <div class="stamp-box">Authorized Signatory</div>
    </div>

    <div class="footer">
      <p>This is a computer-generated receipt. Thank you for choosing ${data.hospital.name}.</p>
      <p>For queries, contact: ${data.hospital.phone} | ${data.hospital.email}</p>
    </div>
  </div>
</body>
</html>`;
  }
}
