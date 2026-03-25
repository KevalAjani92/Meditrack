import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { AddDiagnosisDto } from './dto/add-diagnosis.dto';
import { AddProcedureDto } from './dto/add-procedure.dto';
import { AddPrescriptionDto } from './dto/add-prescription.dto';
import { AddTestDto } from './dto/add-test.dto';
import { AddFollowupDto } from './dto/add-followup.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class OpdConsultationService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // ─── Helpers ─────────────────────────────────────────────────

  private async getDoctorByUserId(userId: number) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { user_id: userId },
    });
    if (!doctor) throw new NotFoundException('Doctor profile not found.');
    return doctor;
  }

  private async getVisit(opdId: number) {
    const visit = await this.prisma.opd_visits.findUnique({
      where: { opd_id: opdId },
    });
    if (!visit) throw new NotFoundException('OPD visit not found.');
    return visit;
  }

  // ─── Get Visit Details (Patient EMR) ─────────────────────────

  async getVisitDetails(userId: number, opdId: number) {
    const visit = await this.prisma.opd_visits.findUnique({
      where: { opd_id: opdId },
      include: {
        patients: {
          include: {
            patient_contact_details: {
              include: { cities: true, states: true },
            },
            patient_medical_details: {
              include: { blood_groups: true },
            },
          },
        },
        doctors: {
          include: {
            users_doctors_user_idTousers: {
              select: { full_name: true },
            },
            departments_master: {
              select: { department_name: true },
            },
          },
        },
        appointments: true,
        queue_tokens: {
          orderBy: { token_id: 'desc' },
          take: 1,
        },
        opd_diagnoses: {
          include: {
            diagnoses: true,
          },
        },
        opd_procedures: {
          include: {
            procedures: true,
          },
        },
        opd_tests: {
          include: {
            tests: true,
          },
        },
        prescriptions: {
          where: { is_active: true },
          include: {
            prescription_items: {
              include: { medicines: true },
            },
          },
        },
        followups: true,
      },
    });

    if (!visit) throw new NotFoundException('OPD visit not found.');

    const patient = visit.patients;
    const contact = patient.patient_contact_details;
    const medical = patient.patient_medical_details;
    const token = visit.queue_tokens[0];

    // Calculate age
    const age = Math.floor(
      (Date.now() - new Date(patient.dob).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000),
    );

    return {
      data: {
        opdId: visit.opd_id,
        opdNo: visit.opd_no,
        patient: {
          id: patient.patient_no,
          patientId: patient.patient_id,
          name: patient.full_name,
          age,
          gender: patient.gender,
          dob: patient.dob.toISOString().split('T')[0],
          type: patient.is_walk_in ? 'Walk-In' : 'Registered',
          phone: contact?.phone_number ?? '',
          email: contact?.email ?? '',
          city: contact?.cities?.city_name ?? '',
          address: contact?.address ?? '',
          bloodGroup:
            medical?.blood_groups?.blood_group_name ?? 'Unknown',
          allergies: medical?.allergies ?? 'None',
          chronicConditions: medical?.chronic_conditions ?? 'None',
          currentMedications: medical?.current_medications ?? 'None',
          tokenNo: token
            ? `T-${String(token.token_number).padStart(2, '0')}`
            : 'N/A',
          visitTime: visit.visit_datetime
            ? new Date(visit.visit_datetime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'N/A',
        },
        chiefComplaint: visit.chief_complaint,
        clinicalNotes: visit.clinical_notes ?? '',
        isEmergency: visit.is_emergency ?? false,
        isFollowUp: visit.is_follow_up,
        doctor: {
          name:
            visit.doctors?.users_doctors_user_idTousers?.full_name ??
            'Unknown',
          department:
            visit.doctors?.departments_master?.department_name ?? '',
        },
        diagnoses: visit.opd_diagnoses.map((d) => ({
          id: d.opd_diagnosis_id,
          diagnosisId: d.diagnosis_id,
          name: d.diagnoses.diagnosis_name,
          code: d.diagnoses.diagnosis_code,
          department: '',
          isPrimary: d.is_primary,
          remarks: d.remarks ?? '',
        })),
        procedures: visit.opd_procedures.map((p) => ({
          id: p.opd_procedure_id,
          procedureId: p.procedure_id,
          name: p.procedures.procedure_name,
          code: p.procedures.procedure_code,
          date: p.procedure_date.toISOString().split('T')[0],
          remarks: p.remarks ?? '',
        })),
        prescriptions: visit.prescriptions.flatMap((pres) =>
          pres.prescription_items.map((item) => ({
            id: item.prescription_item_id,
            prescriptionId: pres.prescription_id,
            medicineId: item.medicine_id,
            medicineName: item.medicines.medicine_name,
            dosage: item.dosage,
            quantity: item.quantity,
            durationDays: item.duration_days,
            instructions: item.instructions ?? '',
            timing: '', // Not tracked in DB schema — frontend-only concept
          })),
        ),
        tests: visit.opd_tests.map((t) => ({
          id: t.opd_test_id,
          testId: t.test_id,
          testName: t.tests.test_name,
          code: t.tests.test_code,
          status: t.test_status,
          remarks: t.result_summary ?? '',
        })),
        followUps: visit.followups.map((f) => ({
          id: f.followup_id,
          date: f.recommended_date.toISOString().split('T')[0],
          reason: f.reason,
          status: f.status,
        })),
      },
    };
  }

  // ─── Past Visits ─────────────────────────────────────────────

  async getPastVisits(opdId: number) {
    const visit = await this.getVisit(opdId);

    const pastVisits = await this.prisma.opd_visits.findMany({
      where: {
        patient_id: visit.patient_id,
        opd_id: { not: opdId },
        is_active: true,
      },
      include: {
        doctors: {
          include: {
            users_doctors_user_idTousers: {
              select: { full_name: true },
            },
            departments_master: {
              select: { department_name: true },
            },
          },
        },
        opd_diagnoses: {
          include: { diagnoses: true },
        },
        opd_procedures: {
          include: { procedures: true },
        },
        opd_tests: {
          include: { tests: true },
        },
        prescriptions: {
          where: { is_active: true },
          include: {
            prescription_items: {
              include: { medicines: true },
            },
          },
        },
      },
      orderBy: { visit_datetime: 'desc' },
      take: 10,
    });

    return {
      data: pastVisits.map((v) => ({
        id: v.opd_id,
        opdNo: v.opd_no,
        date: v.visit_datetime.toISOString().split('T')[0],
        doctor:
          v.doctors?.users_doctors_user_idTousers?.full_name ?? 'Unknown',
        department:
          v.doctors?.departments_master?.department_name ?? '',
        diagnoses: v.opd_diagnoses.map((d) => d.diagnoses.diagnosis_name),
        procedures: v.opd_procedures.map(
          (p) => p.procedures.procedure_name,
        ),
        tests: v.opd_tests.map((t) => t.tests.test_name),
        prescriptions: v.prescriptions.flatMap((pres) =>
          pres.prescription_items.map(
            (item) =>
              `${item.medicines.medicine_name} ${item.dosage}`,
          ),
        ),
      })),
    };
  }

  // ─── Update Visit ────────────────────────────────────────────

  async updateVisit(userId: number, opdId: number, dto: UpdateVisitDto) {
    const visit = await this.getVisit(opdId);

    const updateData: any = {
      modified_by: userId,
      modified_at: new Date(),
    };

    if (dto.chief_complaint !== undefined) {
      updateData.chief_complaint = dto.chief_complaint;
    }
    if (dto.clinical_notes !== undefined) {
      updateData.clinical_notes = dto.clinical_notes;
    }

    await this.prisma.opd_visits.update({
      where: { opd_id: opdId },
      data: updateData,
    });

    return { message: 'Visit updated successfully.' };
  }

  // ─── Diagnoses CRUD ──────────────────────────────────────────

  async addDiagnosis(opdId: number, dto: AddDiagnosisDto) {
    await this.getVisit(opdId);

    // Check for duplicate
    const existing = await this.prisma.opd_diagnoses.findFirst({
      where: {
        visit_id: opdId,
        diagnosis_id: dto.diagnosis_id,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'This diagnosis is already added to the visit.',
      );
    }

    const record = await this.prisma.opd_diagnoses.create({
      data: {
        visit_id: opdId,
        diagnosis_id: dto.diagnosis_id,
        is_primary: dto.is_primary ?? false,
        remarks: dto.remarks ?? null,
      },
      include: {
        diagnoses: true,
      },
    });

    return {
      message: 'Diagnosis added successfully.',
      data: {
        id: record.opd_diagnosis_id,
        diagnosisId: record.diagnosis_id,
        name: record.diagnoses.diagnosis_name,
        code: record.diagnoses.diagnosis_code,
        isPrimary: record.is_primary,
        remarks: record.remarks ?? '',
      },
    };
  }

  async removeDiagnosis(opdId: number, diagId: number) {
    const record = await this.prisma.opd_diagnoses.findFirst({
      where: {
        opd_diagnosis_id: diagId,
        visit_id: opdId,
      },
    });

    if (!record) throw new NotFoundException('Diagnosis not found.');

    await this.prisma.opd_diagnoses.delete({
      where: { opd_diagnosis_id: diagId },
    });

    return { message: 'Diagnosis removed successfully.' };
  }

  // ─── Procedures CRUD ────────────────────────────────────────

  async addProcedure(opdId: number, dto: AddProcedureDto) {
    await this.getVisit(opdId);

    const record = await this.prisma.opd_procedures.create({
      data: {
        visit_id: opdId,
        procedure_id: dto.procedure_id,
        procedure_date: new Date(dto.procedure_date),
        remarks: dto.remarks ?? null,
      },
      include: {
        procedures: true,
      },
    });

    return {
      message: 'Procedure added successfully.',
      data: {
        id: record.opd_procedure_id,
        procedureId: record.procedure_id,
        name: record.procedures.procedure_name,
        code: record.procedures.procedure_code,
        date: record.procedure_date.toISOString().split('T')[0],
        remarks: record.remarks ?? '',
      },
    };
  }

  async removeProcedure(opdId: number, procId: number) {
    const record = await this.prisma.opd_procedures.findFirst({
      where: {
        opd_procedure_id: procId,
        visit_id: opdId,
      },
    });

    if (!record) throw new NotFoundException('Procedure not found.');

    await this.prisma.opd_procedures.delete({
      where: { opd_procedure_id: procId },
    });

    return { message: 'Procedure removed successfully.' };
  }

  // ─── Prescriptions ──────────────────────────────────────────

  async savePrescription(
    userId: number,
    opdId: number,
    dto: AddPrescriptionDto,
  ) {
    const visit = await this.getVisit(opdId);
    const doctor = await this.getDoctorByUserId(userId);

    if (dto.items.length === 0) {
      throw new BadRequestException(
        'At least one prescription item is required.',
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const prescription = await tx.prescriptions.create({
        data: {
          visit_id: opdId,
          doctor_id: doctor.doctor_id,
          notes: dto.notes ?? null,
          is_active: true,
          created_by: userId,
          modified_by: userId,
        },
      });

      const items = await Promise.all(
        dto.items.map((item) =>
          tx.prescription_items.create({
            data: {
              prescription_id: prescription.prescription_id,
              medicine_id: item.medicine_id,
              dosage: item.dosage,
              quantity: item.quantity,
              duration_days: item.duration_days,
              instructions: item.instructions ?? null,
            },
            include: { medicines: true },
          }),
        ),
      );

      return { prescription, items };
    });

    return {
      message: 'Prescription saved successfully.',
      data: result.items.map((item) => ({
        id: item.prescription_item_id,
        prescriptionId: result.prescription.prescription_id,
        medicineId: item.medicine_id,
        medicineName: item.medicines.medicine_name,
        dosage: item.dosage,
        quantity: item.quantity,
        durationDays: item.duration_days,
        instructions: item.instructions ?? '',
      })),
    };
  }

  // ─── Tests CRUD ─────────────────────────────────────────────

  async orderTest(opdId: number, dto: AddTestDto) {
    await this.getVisit(opdId);

    const record = await this.prisma.opd_tests.create({
      data: {
        visit_id: opdId,
        test_id: dto.test_id,
        test_status: 'Ordered',
        result_summary: dto.remarks ?? null,
      },
      include: {
        tests: true,
      },
    });

    return {
      message: 'Test ordered successfully.',
      data: {
        id: record.opd_test_id,
        testId: record.test_id,
        testName: record.tests.test_name,
        code: record.tests.test_code,
        status: record.test_status,
        remarks: record.result_summary ?? '',
      },
    };
  }

  async removeTest(opdId: number, testId: number) {
    const record = await this.prisma.opd_tests.findFirst({
      where: {
        opd_test_id: testId,
        visit_id: opdId,
      },
    });

    if (!record) throw new NotFoundException('Test order not found.');

    await this.prisma.opd_tests.delete({
      where: { opd_test_id: testId },
    });

    return { message: 'Test order removed successfully.' };
  }

  // ─── Follow-ups CRUD ───────────────────────────────────────

  async scheduleFollowup(opdId: number, dto: AddFollowupDto) {
    await this.getVisit(opdId);

    const record = await this.prisma.followups.create({
      data: {
        visit_id: opdId,
        recommended_date: new Date(dto.recommended_date),
        reason: dto.reason,
        status: 'Pending',
      },
    });

    return {
      message: 'Follow-up scheduled successfully.',
      data: {
        id: record.followup_id,
        date: record.recommended_date.toISOString().split('T')[0],
        reason: record.reason,
        status: record.status,
      },
    };
  }

  async removeFollowup(opdId: number, followupId: number) {
    const record = await this.prisma.followups.findFirst({
      where: {
        followup_id: followupId,
        visit_id: opdId,
      },
    });

    if (!record) throw new NotFoundException('Follow-up not found.');

    await this.prisma.followups.delete({
      where: { followup_id: followupId },
    });

    return { message: 'Follow-up removed successfully.' };
  }

  // ─── Complete Consultation ──────────────────────────────────

  async completeConsultation(userId: number, opdId: number) {
    const visit = await this.prisma.opd_visits.findUnique({
      where: { opd_id: opdId },
      include: {
        queue_tokens: {
          where: { status: 'In Progress' },
          take: 1,
        },
        appointments: true,
      },
    });

    if (!visit) throw new NotFoundException('OPD visit not found.');

    await this.prisma.$transaction(async (tx) => {
      // Update queue token to Completed
      if (visit.queue_tokens.length > 0) {
        await tx.queue_tokens.update({
          where: { token_id: visit.queue_tokens[0].token_id },
          data: {
            status: 'Completed',
            completed_at: new Date(),
          },
        });
      }

      // Update appointment status to Completed
      if (visit.appointment_id) {
        await tx.appointments.update({
          where: { appointment_id: visit.appointment_id },
          data: {
            appointment_status: 'Completed',
            modified_by: userId,
            modified_at: new Date(),
          },
        });
      }

      // Update OPD visit
      await tx.opd_visits.update({
        where: { opd_id: opdId },
        data: {
          modified_by: userId,
          modified_at: new Date(),
        },
      });
    });

    // Emit real-time event
    this.eventsGateway.emitConsultationCompleted(
      visit.doctor_id,
      opdId,
    );
    this.eventsGateway.emitQueueUpdate(visit.doctor_id, {
      event: 'consultation-completed',
      opdId,
    });

    return { message: 'Consultation completed successfully.' };
  }

  // ─── Lookup APIs (for Dropdown SearchableSelects) ───────────

  async lookupDiagnoses(userId: number, search?: string) {
    const doctor = await this.getDoctorByUserId(userId);

    const where: any = {
      hospital_id: doctor.hospital_id,
      is_active: true,
    };

    if (search) {
      where.diagnoses = {
        OR: [
          {
            diagnosis_name: { contains: search, mode: 'insensitive' },
          },
          {
            diagnosis_code: { contains: search, mode: 'insensitive' },
          },
        ],
      };
    }

    const records = await this.prisma.hospital_diagnoses.findMany({
      where,
      include: {
        diagnoses: true,
      },
      take: 30,
    });

    return {
      data: records.map((r) => ({
        label: `${r.diagnoses.diagnosis_name} (${r.diagnoses.diagnosis_code})`,
        value: `${r.diagnoses.diagnosis_name}|${r.diagnoses.diagnosis_code}`,
        id: r.diagnoses.diagnosis_id,
      })),
    };
  }

  async lookupProcedures(userId: number, search?: string) {
    const doctor = await this.getDoctorByUserId(userId);

    const where: any = {
      hospital_id: doctor.hospital_id,
      is_active: true,
    };

    if (search) {
      where.procedures = {
        OR: [
          {
            procedure_name: { contains: search, mode: 'insensitive' },
          },
          {
            procedure_code: { contains: search, mode: 'insensitive' },
          },
        ],
      };
    }

    const records = await this.prisma.hospital_procedures.findMany({
      where,
      include: {
        procedures: true,
      },
      take: 30,
    });

    return {
      data: records.map((r) => ({
        label: `${r.procedures.procedure_name} (${r.procedures.procedure_code})`,
        value: `${r.procedures.procedure_name}|${r.procedures.procedure_code}`,
        id: r.procedures.procedure_id,
      })),
    };
  }

  async lookupMedicines(userId: number, search?: string) {
    const doctor = await this.getDoctorByUserId(userId);

    const where: any = {
      hospital_id: doctor.hospital_id,
      is_active: true,
    };

    if (search) {
      where.medicines = {
        OR: [
          {
            medicine_name: { contains: search, mode: 'insensitive' },
          },
          {
            medicine_code: { contains: search, mode: 'insensitive' },
          },
        ],
      };
    }

    const records = await this.prisma.hospital_medicines.findMany({
      where,
      include: {
        medicines: true,
      },
      take: 30,
    });

    return {
      data: records.map((r) => ({
        label: `${r.medicines.medicine_name} (${r.medicines.medicine_type} - ${r.medicines.strength})`,
        value: r.medicines.medicine_name,
        id: r.medicines.medicine_id,
      })),
    };
  }

  async lookupTests(userId: number, search?: string) {
    const doctor = await this.getDoctorByUserId(userId);

    const where: any = {
      hospital_id: doctor.hospital_id,
      is_active: true,
    };

    if (search) {
      where.tests = {
        OR: [
          { test_name: { contains: search, mode: 'insensitive' } },
          { test_code: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const records = await this.prisma.hospital_tests.findMany({
      where,
      include: {
        tests: true,
      },
      take: 30,
    });

    return {
      data: records.map((r) => ({
        label: `${r.tests.test_name} | ${r.tests.test_code}`,
        value: `${r.tests.test_name}|${r.tests.test_code}`,
        id: r.tests.test_id,
      })),
    };
  }
}
