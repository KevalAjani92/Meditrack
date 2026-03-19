import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOpdDto, VisitType } from './dto/create-opd.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueService } from './queue.service';
import { CounterService } from 'src/common/services/counter/counter.service';

@Injectable()
export class OpdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
    private readonly counterService: CounterService,
  ) {}

  // async createOpd(dto: CreateOpdDto, userId: number) {
  //   return this.prisma.$transaction(async (tx) => {
  //     const opdNo = await this.counterService.generateOpdNumber(
  //       tx,
  //       dto.hospital_id,
  //       userId,
  //     );

  //     const opd = await tx.opd_visits.create({
  //       data: {
  //         hospital_id: dto.hospital_id,
  //         patient_id: dto.patient_id,
  //         doctor_id: dto.doctor_id,

  //         appointment_id: dto.appointment_id,

  //         old_opd_id: dto.old_opd_id,

  //         opd_no: opdNo,

  //         visit_datetime: new Date(),

  //         chief_complaint: dto.chief_complaint,

  //         clinical_notes: dto.clinical_notes,

  //         is_emergency: dto.visitType === VisitType.Emergency,

  //         is_follow_up: dto.visitType === VisitType.FollowUp,

  //         created_by: userId,

  //         modified_by: userId,
  //       },
  //     });

  //     const queue = await this.queueService.getOrCreateDailyQueue(
  //       tx,
  //       dto.hospital_id,
  //       dto.doctor_id,
  //       userId,
  //     );

  //     const token = await this.queueService.createQueueToken(
  //       tx,
  //       queue.daily_queue_id,
  //       opd.opd_id,
  //       dto.skip_queue ?? false,
  //     );

  //     if (dto.appointment_id) {
  //       await tx.appointments.update({
  //         where: { appointment_id: dto.appointment_id },
  //         data: { appointment_status: 'Completed' },
  //       });
  //     }

  //     const patient = await tx.patients.findUnique({
  //       where: { patient_id: dto.patient_id },
  //       select: { full_name: true },
  //     });

  //     const doctor = await tx.doctors.findUnique({
  //       where: { doctor_id: dto.doctor_id },
  //       include: {
  //         users_doctors_user_idTousers: true,
  //       },
  //     });

  //     return {
  //       opd_no: opd.opd_no,
  //       token: token.token_number,
  //       patient: patient?.full_name,
  //       doctor: doctor?.users_doctors_user_idTousers.full_name,
  //     };
  //   });
  // }

  async createOpd(dto: CreateOpdDto, userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.$transaction(async (tx) => {
      /* ------------------------------------------------
       1️⃣ Validate Patient
    ------------------------------------------------ */

      const patient = await tx.patients.findUnique({
        where: { patient_id: dto.patient_id },
      });

      if (!patient || !patient.is_active) {
        throw new NotFoundException('Patient not found');
      }

      /* ------------------------------------------------
       2️⃣ Validate Doctor
    ------------------------------------------------ */

      const doctor = await tx.doctors.findUnique({
        where: { doctor_id: dto.doctor_id },
      });

      if (!doctor || !doctor.is_active) {
        throw new NotFoundException('Doctor not found');
      }

      if (doctor.hospital_id !== dto.hospital_id) {
        throw new BadRequestException(
          'Doctor does not belong to selected hospital',
        );
      }

      /* ------------------------------------------------
       3️⃣ Prevent Duplicate OPD
    ------------------------------------------------ */

      const existingOpd = await tx.opd_visits.findFirst({
        where: {
          patient_id: dto.patient_id,
          doctor_id: dto.doctor_id,
          visit_datetime: {
            gte: today,
          },
          is_active: true,
        },
      });

      if (existingOpd) {
        throw new ConflictException(
          'Patient already has an OPD with this doctor today',
        );
      }

      /* ------------------------------------------------
       4️⃣ Appointment Validation
    ------------------------------------------------ */

      if (dto.appointment_id) {
        const appointment = await tx.appointments.findUnique({
          where: { appointment_id: dto.appointment_id },
        });

        if (!appointment) {
          throw new NotFoundException('Appointment not found');
        }

        if (appointment.appointment_status === 'Cancelled') {
          throw new BadRequestException('Cancelled appointment cannot be used');
        }

        if (appointment.patient_id !== dto.patient_id) {
          throw new BadRequestException(
            'Appointment does not belong to patient',
          );
        }

        if (appointment.doctor_id !== dto.doctor_id) {
          throw new BadRequestException('Appointment doctor mismatch');
        }

        const existingVisit = await tx.opd_visits.findFirst({
          where: { appointment_id: dto.appointment_id },
        });

        if (existingVisit) {
          throw new ConflictException('Appointment already converted to OPD');
        }
      }

      /* ------------------------------------------------
       5️⃣ Follow-Up Validation
    ------------------------------------------------ */

      if (dto.visitType === VisitType.FollowUp) {
        if (!dto.old_opd_id) {
          throw new BadRequestException('Old OPD required');
        }

        const oldOpd = await tx.opd_visits.findUnique({
          where: { opd_id: dto.old_opd_id },
        });

        if (!oldOpd) {
          throw new NotFoundException('Previous OPD not found');
        }

        if (oldOpd.patient_id !== dto.patient_id) {
          throw new BadRequestException(
            'Previous OPD does not belong to patient',
          );
        }
      }

      /* ------------------------------------------------
       6️⃣ Doctor Availability Check
    ------------------------------------------------ */

      if (dto.visitType !== VisitType.Emergency) {
        const day = new Date().getDay() + 1;

        const availability = await tx.doctor_availability.findUnique({
          where: {
            doctor_id_day_of_week: {
              doctor_id: dto.doctor_id,
              day_of_week: day,
            },
          },
        });

        if (!availability || !availability.is_available) {
          throw new BadRequestException('Doctor not available today');
        }
      }

      /* ------------------------------------------------
       7️⃣ Generate OPD Number
    ------------------------------------------------ */

      const opdNo = await this.counterService.generateOpdNumber(
        tx,
        dto.hospital_id,
        userId,
      );

      /* ------------------------------------------------
       8️⃣ Create OPD
    ------------------------------------------------ */

      const opd = await tx.opd_visits.create({
        data: {
          hospital_id: dto.hospital_id,
          patient_id: dto.patient_id,
          doctor_id: dto.doctor_id,
          appointment_id: dto.appointment_id,
          old_opd_id: dto.old_opd_id,
          opd_no: opdNo,
          visit_datetime: new Date(),
          chief_complaint: dto.chief_complaint,
          clinical_notes: dto.clinical_notes,
          is_emergency: dto.visitType === VisitType.Emergency,
          is_follow_up: dto.visitType === VisitType.FollowUp,
          created_by: userId,
          modified_by: userId,
        },
      });

      /* ------------------------------------------------
       9️⃣ Queue Handling
    ------------------------------------------------ */

      const queue = await this.queueService.getOrCreateDailyQueue(
        tx,
        dto.hospital_id,
        dto.doctor_id,
        userId,
      );

      const token = await this.queueService.createQueueToken(
        tx,
        queue.daily_queue_id,
        opd.opd_id,
        dto.skip_queue ?? false,
      );

      /* ------------------------------------------------
       🔟 Update Appointment
    ------------------------------------------------ */

      if (dto.appointment_id) {
        await tx.appointments.update({
          where: { appointment_id: dto.appointment_id },
          data: { appointment_status: 'Waiting' },
        });
      }

      /* ------------------------------------------------
       Response
    ------------------------------------------------ */

      return {
        opd_no: opd.opd_no,
        token: token.token_number,
        patient: patient.full_name,
        doctor: doctor.doctor_id,
      };
    });
  }
}
