import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';

// import puppeteer from 'puppeteer';
import puppeteer, { Browser } from 'puppeteer-core';
import chromium from 'chromium';

@Injectable()
export class BillingPaymentsService implements OnModuleInit, OnModuleDestroy {
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

  // ─── GET PAYMENT MODES ────────────────────────────────────────
  async getPaymentModes() {
    const modes = await this.prisma.payment_modes.findMany({
      where: { is_active: true },
      orderBy: { payment_mode_id: 'asc' },
    });

    return {
      data: modes.map((m) => ({
        paymentModeId: m.payment_mode_id,
        paymentModeName: m.payment_mode_name,
        requiresReference: m.requires_reference,
      })),
    };
  }

  // ─── GET PAYMENTS LIST (Paginated + Filtered + Stats) ──────────
  async getPayments(hospitalId: number, query: GetPaymentsQueryDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {
      is_active: true,
      billing: {
        hospital_id: hospitalId,
        is_active: true,
      },
    };

    // Search across patient name, bill number, phone, reference number
    if (query.search) {
      where.OR = [
        {
          billing: {
            bill_number: { contains: query.search, mode: 'insensitive' },
            hospital_id: hospitalId,
            is_active: true,
          },
        },
        {
          billing: {
            opd_visits: {
              patients: {
                full_name: { contains: query.search, mode: 'insensitive' },
              },
            },
            hospital_id: hospitalId,
            is_active: true,
          },
        },
        {
          billing: {
            opd_visits: {
              patients: {
                patient_contact_details: {
                  phone_number: { contains: query.search, mode: 'insensitive' },
                },
              },
            },
            hospital_id: hospitalId,
            is_active: true,
          },
        },
        {
          reference_number: { contains: query.search, mode: 'insensitive' },
          billing: { hospital_id: hospitalId, is_active: true },
        },
      ];
    }

    // Mode filter
    if (query.mode && query.mode !== 'All') {
      where.payment_modes = {
        payment_mode_name: query.mode,
      };
    }

    // Status filter
    if (query.status && query.status !== 'All') {
      where.payment_status = query.status;
    }

    // Date range filter
    if (query.fromDate || query.toDate) {
      where.payment_date = {};
      if (query.fromDate) {
        where.payment_date.gte = new Date(`${query.fromDate}T00:00:00.000Z`);
      }
      if (query.toDate) {
        where.payment_date.lte = new Date(`${query.toDate}T23:59:59.999Z`);
      }
    }

    // Stats base where (hospital-wide, no filters)
    const statsWhere: any = {
      is_active: true,
      billing: { hospital_id: hospitalId, is_active: true },
    };

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    // console.log(query.fromDate, ' -- ', query.toDate);

    const [
      payments,
      totalCount,
      todaysPayments,
      pendingCount,
      successCount,
      failedCount,
    ] = await this.prisma.$transaction([
      this.prisma.payments.findMany({
        where,
        skip,
        take: limit,
        include: {
          payment_modes: true,
          users_payments_received_byTousers: true,
          billing: {
            include: {
              opd_visits: {
                include: {
                  patients: { include: { patient_contact_details: true } },
                  doctors: { include: { users_doctors_user_idTousers: true } },
                },
              },
            },
          },
        },
        orderBy: { payment_date: 'desc' },
      }),
      this.prisma.payments.count({ where }),
      this.prisma.payments.findMany({
        where: {
          ...statsWhere,
          payment_date: { gte: todayStart, lte: todayEnd },
          payment_status: 'Success',
        },
        select: { amount_paid: true },
      }),
      this.prisma.payments.count({
        where: { ...statsWhere, payment_status: 'Pending' },
      }),
      this.prisma.payments.count({
        where: { ...statsWhere, payment_status: 'Success' },
      }),
      this.prisma.payments.count({
        where: { ...statsWhere, payment_status: 'Failed' },
      }),
    ]);

    const todaysRevenue = todaysPayments.reduce(
      (sum, p) => sum + Number(p.amount_paid),
      0,
    );
    const todaysPaymentCount = todaysPayments.length;

    return {
      data: {
        data: payments.map((p) => ({
          id: p.payment_id,
          paymentId: `PAY-${String(p.payment_id).padStart(6, '0')}`,
          date: new Date(p.payment_date).toISOString().split('T')[0],
          time: new Date(p.payment_date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          billId: p.bill_id,
          billNumber: p.billing.bill_number,
          patientName: p.billing.opd_visits.patients.full_name,
          patientPhone:
            p.billing.opd_visits.patients.patient_contact_details
              ?.phone_number || '-',
          doctorName:
            p.billing.opd_visits.doctors.users_doctors_user_idTousers.full_name,
          mode: p.payment_modes.payment_mode_name,
          referenceNumber: p.reference_number || '-',
          amount: Number(p.amount_paid),
          status: p.payment_status,
          receivedBy: p.users_payments_received_byTousers.full_name,
        })),
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
        stats: {
          todaysRevenue,
          todaysPayments: todaysPaymentCount,
          pending: pendingCount,
          success: successCount,
          failed: failedCount,
        },
      },
    };
  }

  // ─── RECORD PAYMENT ───────────────────────────────────────────
  async recordPayment(
    hospitalId: number,
    dto: CreatePaymentDto,
    userId: number,
  ) {
    // Validate bill exists and belongs to hospital
    const bill = await this.prisma.billing.findFirst({
      where: { bill_id: dto.bill_id, hospital_id: hospitalId, is_active: true },
      include: {
        payments: {
          where: { is_active: true, payment_status: 'Success' },
        },
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (bill.billing_status !== 'Finalized') {
      throw new BadRequestException(
        'Payment can only be recorded for finalized bills',
      );
    }

    // Validate payment mode
    const mode = await this.prisma.payment_modes.findUnique({
      where: { payment_mode_id: dto.payment_mode_id },
    });

    if (!mode || !mode.is_active) {
      throw new BadRequestException('Invalid payment mode');
    }

    // Validate amount
    const totalPaid = bill.payments.reduce(
      (sum, p) => sum + Number(p.amount_paid),
      0,
    );
    const totalAmount = Number(bill.total_amount);
    const remaining = totalAmount - totalPaid;

    if (dto.amount_paid > remaining) {
      throw new BadRequestException(
        `Payment amount exceeds remaining balance of ₹${remaining.toFixed(2)}`,
      );
    }

    // Validate reference if required
    if (mode.requires_reference && !dto.reference_number) {
      throw new BadRequestException(
        `Reference number is required for ${mode.payment_mode_name} payments`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Create payment
      const payment = await tx.payments.create({
        data: {
          bill_id: dto.bill_id,
          payment_mode_id: dto.payment_mode_id,
          amount_paid: parseFloat(dto.amount_paid.toFixed(2)),
          reference_number: dto.reference_number || null,
          payment_status: 'Success',
          received_by: userId,
          created_by: userId,
          modified_by: userId,
        },
      });

      // Update bill payment status
      const newTotalPaid = totalPaid + dto.amount_paid;
      let newPaymentStatus = 'Pending';
      if (newTotalPaid >= totalAmount) {
        newPaymentStatus = 'Paid';
      } else if (newTotalPaid > 0) {
        newPaymentStatus = 'Partially Paid';
      }

      await tx.billing.update({
        where: { bill_id: dto.bill_id },
        data: {
          payment_status: newPaymentStatus,
          modified_by: userId,
          modified_at: new Date(),
        },
      });

      return {
        message: 'Payment recorded successfully',
        data: {
          paymentId: payment.payment_id,
          paymentStatus: newPaymentStatus,
          totalPaid: newTotalPaid,
          remaining: totalAmount - newTotalPaid,
        },
      };
    });
  }

  // ─── GET PAYMENT DETAIL ────────────────────────────────────────
  async getPaymentDetail(hospitalId: number, paymentId: number) {
    const payment = await this.prisma.payments.findFirst({
      where: {
        payment_id: paymentId,
        is_active: true,
        billing: { hospital_id: hospitalId, is_active: true },
      },
      include: {
        payment_modes: true,
        users_payments_received_byTousers: true,
        billing: {
          include: {
            hospitals: true,
            opd_visits: {
              include: {
                patients: { include: { patient_contact_details: true } },
                doctors: { include: { users_doctors_user_idTousers: true } },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const visit = payment.billing.opd_visits;

    return {
      data: {
        payment: {
          paymentId: payment.payment_id,
          paymentDisplayId: `PAY-${String(payment.payment_id).padStart(6, '0')}`,
          paymentDate: payment.payment_date,
          amountPaid: Number(payment.amount_paid),
          paymentMode: payment.payment_modes.payment_mode_name,
          referenceNumber: payment.reference_number || '-',
          paymentStatus: payment.payment_status,
          receivedBy: payment.users_payments_received_byTousers.full_name,
        },
        bill: {
          billId: payment.billing.bill_id,
          billNumber: payment.billing.bill_number,
          billDate: payment.billing.bill_date,
          totalAmount: Number(payment.billing.total_amount),
          paymentStatus: payment.billing.payment_status,
        },
        patient: {
          patientName: visit.patients.full_name,
          patientNo: visit.patients.patient_no,
          phone: visit.patients.patient_contact_details?.phone_number || '-',
        },
        doctor: {
          doctorName: visit.doctors.users_doctors_user_idTousers.full_name,
        },
        hospital: {
          name: payment.billing.hospitals.hospital_name,
          code: payment.billing.hospitals.hospital_code,
          address: payment.billing.hospitals.address,
          phone:
            payment.billing.hospitals.contact_phone ||
            payment.billing.hospitals.receptionist_contact,
          email: payment.billing.hospitals.contact_email || '-',
          registrationNo: payment.billing.hospitals.registration_no || '-',
          gstNo: payment.billing.hospitals.gst_no || '-',
        },
      },
    };
  }

  // ─── GET RECEIPT PRINT DATA ────────────────────────────────────
  async getReceiptPrintData(hospitalId: number, paymentId: number) {
    return this.getPaymentDetail(hospitalId, paymentId);
  }

  // ─── GENERATE RECEIPT PDF ──────────────────────────────────────
  async generateReceiptPdf(
    hospitalId: number,
    paymentId: number,
  ): Promise<Buffer> {
    const result = await this.getReceiptPrintData(hospitalId, paymentId);
    const data = result.data;
    const html = this.buildReceiptHtml(data);

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });
    if (!this.browser) {
      throw new Error('PDF Generator is not properly initialized.');
    }
    let page;
    try {
      page = await this.browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A5',
        printBackground: true,
        margin: { top: '5mm', bottom: '5mm', left: '10mm', right: '10mm' },
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

  // ─── BUILD RECEIPT HTML ────────────────────────────────────────
  private buildReceiptHtml(data: any): string {
    const statusClass =
      data.payment.paymentStatus === 'Success'
        ? 'badge-paid'
        : data.payment.paymentStatus === 'Pending'
          ? 'badge-pending'
          : 'badge-failed';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a2e; font-size: 12px; line-height: 1.5; }
    .container { max-width: 500px; margin: 0 auto; padding: 20px; }

    .header { text-align: center; border-bottom: 3px solid #0f766e; padding-bottom: 12px; margin-bottom: 16px; }
    .hospital-name { font-size: 18px; font-weight: 800; color: #0f766e; letter-spacing: 1px; }
    .hospital-sub { font-size: 9px; color: #555; margin-top: 3px; }
    .receipt-title { font-size: 13px; font-weight: 700; color: #0f766e; margin-top: 10px; letter-spacing: 2px; text-transform: uppercase; border: 2px solid #0f766e; display: inline-block; padding: 3px 16px; }

    .amount-box { text-align: center; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 2px solid #0f766e; border-radius: 10px; padding: 16px; margin: 16px 0; }
    .amount-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #0f766e; font-weight: 700; }
    .amount-value { font-size: 32px; font-weight: 900; color: #0f766e; margin-top: 4px; }
    .amount-mode { font-size: 11px; color: #555; margin-top: 6px; background: white; display: inline-block; padding: 2px 12px; border-radius: 20px; border: 1px solid #e5e7eb; }

    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 14px 0; }
    .detail-item { background: #f9fafb; padding: 8px 10px; border-radius: 6px; border: 1px solid #e5e7eb; }
    .detail-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 700; }
    .detail-value { font-size: 11px; font-weight: 600; color: #1a1a2e; margin-top: 2px; }

    .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-paid { background: #dcfce7; color: #166534; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-failed { background: #fee2e2; color: #991b1b; }

    .divider { border: none; border-top: 1px dashed #d1d5db; margin: 14px 0; }

    .footer { text-align: center; margin-top: 20px; padding-top: 12px; border-top: 2px solid #e5e7eb; font-size: 9px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="hospital-name">${data.hospital.name}</div>
      <div class="hospital-sub">${data.hospital.address}</div>
      <div class="hospital-sub">Phone: ${data.hospital.phone} | Email: ${data.hospital.email}</div>
      <div class="receipt-title">Transaction Receipt</div>
    </div>

    <div style="text-align: center; margin-bottom: 12px;">
      <span class="badge ${statusClass}">${data.payment.paymentStatus}</span>
    </div>

    <div class="amount-box">
      <div class="amount-label">Amount Paid</div>
      <div class="amount-value">₹${data.payment.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
      <div class="amount-mode">${data.payment.paymentMode} Payment</div>
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Receipt No.</div>
        <div class="detail-value">${data.payment.paymentDisplayId}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Date & Time</div>
        <div class="detail-value">${new Date(data.payment.paymentDate).toLocaleString('en-IN')}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Reference No.</div>
        <div class="detail-value">${data.payment.referenceNumber}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Received By</div>
        <div class="detail-value">${data.payment.receivedBy}</div>
      </div>
    </div>

    <hr class="divider" />

    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Patient Name</div>
        <div class="detail-value">${data.patient.patientName}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Patient ID</div>
        <div class="detail-value">${data.patient.patientNo}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Bill Number</div>
        <div class="detail-value" style="color: #0f766e;">${data.bill.billNumber}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Doctor</div>
        <div class="detail-value">${data.doctor.doctorName}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Bill Amount</div>
        <div class="detail-value">₹${data.bill.totalAmount.toFixed(2)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Phone</div>
        <div class="detail-value">${data.patient.phone}</div>
      </div>
    </div>

    <div class="footer">
      <p>This is a computer-generated receipt. No signature is required.</p>
      <p>Thank you for choosing ${data.hospital.name}.</p>
      <p>For queries, contact: ${data.hospital.phone}</p>
    </div>
  </div>
</body>
</html>`;
  }
}
