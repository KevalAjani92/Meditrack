import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { CounterService } from 'src/common/services/counter/counter.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private counterService: CounterService,
  ) {}

  // ─── Hardcoded fallbacks (matches existing codebase pattern) ───
  private GROUP_ID = 1;
  private USER_ID = 2;

  /**
   * Step 1 — List all active hospitals for the patient's hospital group.
   */
  async getHospitalsForBooking(hospitalGroupId?: number) {
    const groupId = hospitalGroupId ?? this.GROUP_ID;

    const hospitals = await this.prisma.hospitals.findMany({
      where: {
        hospital_group_id: groupId,
        is_active: true,
      },
      orderBy: { hospital_name: 'asc' },
      include: {
        cities: true,
        states: true,
      },
    });

    return {
      data: hospitals.map((h) => ({
        hospital_id: h.hospital_id,
        hospital_name: h.hospital_name,
        address: h.address,
        city_name: h.cities?.city_name ?? null,
        state_name: h.states?.state_name ?? null,
        pincode: h.pincode,
        contact_phone: h.contact_phone,
        opening_time: h.opening_time,
        closing_time: h.closing_time,
        is_24by7: h.is_24by7,
      })),
    };
  }

  /**
   * Step 2 — List active departments for a specific hospital.
   */
  async getDepartmentsByHospital(hospitalId: number) {
    const hospital = await this.prisma.hospitals.findUnique({
      where: { hospital_id: hospitalId },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const hospitalDepartments = await this.prisma.hospital_departments.findMany(
      {
        where: {
          hospital_id: hospitalId,
          is_active: true,
        },
        include: {
          departments_master: true,
        },
        orderBy: {
          departments_master: { department_name: 'asc' },
        },
      },
    );

    return {
      data: hospitalDepartments.map((hd) => ({
        department_id: hd.departments_master.department_id,
        department_name: hd.departments_master.department_name,
        department_code: hd.departments_master.department_code,
        description: hd.departments_master.description,
      })),
    };
  }

  /**
   * Step 3 — List active doctors in a department + hospital.
   */
  async getDoctorsByDepartment(departmentId: number, hospitalId: number) {
    const doctors = await this.prisma.doctors.findMany({
      where: {
        department_id: departmentId,
        hospital_id: hospitalId,
        is_active: true,
      },
      include: {
        users_doctors_user_idTousers: {
          select: { full_name: true, profile_image_url: true },
        },
        specializations: {
          select: { specialization_name: true },
        },
      },
      orderBy: { doctor_id: 'asc' },
    });

    return {
      data: doctors.map((doc) => {
        const fullName =
          doc.users_doctors_user_idTousers?.full_name ?? 'Unknown';
        const initials = fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return {
          doctor_id: doc.doctor_id,
          name: fullName,
          specialization:
            doc.specializations?.specialization_name ?? doc.qualification,
          experience: doc.experience_years,
          fee: Number(doc.consultation_fees),
          available: doc.is_available,
          avatar: initials,
          profile_image_url:
            doc.users_doctors_user_idTousers?.profile_image_url ?? null,
        };
      }),
    };
  }

  /**
   * Step 4 — Get doctor's availability slots for a specific date.
   *
   * Logic:
   *  1. Get the day_of_week (0-6) from the date.
   *  2. Query `doctor_availability` for that day.
   *  3. Generate time slots between start_time and end_time (30-min intervals).
   *  4. For each slot, count existing appointments on that date/time.
   *  5. Return slots with remaining capacity.
   */
  async getDoctorAvailability(doctorId: number, dateStr: string) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { doctor_id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const date = new Date(dateStr);
    const dayOfWeek = date.getDay() + 1; // 0 = Sunday

    const availability = await this.prisma.doctor_availability.findUnique({
      where: {
        doctor_id_day_of_week: {
          doctor_id: doctorId,
          day_of_week: dayOfWeek,
        },
      },
    });

    if (!availability || !availability.is_available) {
      return {
        data: {
          doctor_id: doctorId,
          date: dateStr,
          is_available: false,
          slots: [],
        },
      };
    }

    // Generate 30-minute time slots between start and end time
    const slots = this.generateTimeSlots(
      availability.start_time,
      availability.end_time,
    );

    // Count existing booked appointments for each slot on this date
    const [year, month, day] = dateStr.split('-').map(Number);
    const appointmentDate = new Date(Date.UTC(year, month - 1, day));

    const existingAppointments = await this.prisma.appointments.findMany({
      where: {
        doctor_id: doctorId,
        appointment_date: {
          equals: appointmentDate,
        },
        appointment_status: {
          in: ['Scheduled', 'Checked-In', 'Rescheduled'],
        },
        is_active: true,
      },
      select: {
        appointment_time: true,
      },
    });

    // Count appointments per time slot
    const bookedCountByTime = new Map<string, number>();
    for (const apt of existingAppointments) {
      const timeKey = this.formatTime(apt.appointment_time);
      bookedCountByTime.set(timeKey, (bookedCountByTime.get(timeKey) || 0) + 1);
    }

    // Calculate max per slot (total max / number of slots)
    const maxPerSlot = Math.max(
      1,
      Math.floor(availability.max_appointments / Math.max(slots.length, 1)),
    );

    const slotsWithCapacity = slots.map((slotTime) => {
      const booked = bookedCountByTime.get(slotTime) || 0;
      const remaining = Math.max(0, maxPerSlot - booked);
      return {
        time: slotTime,
        capacity: remaining,
        is_full: remaining === 0,
      };
    });

    return {
      data: {
        doctor_id: doctorId,
        date: dateStr,
        is_available: true,
        max_appointments: availability.max_appointments,
        slots: slotsWithCapacity,
      },
    };
  }

  /**
   * Step 6 — Book an appointment.
   *
   * 1. Validate doctor exists and is available.
   * 2. Check for duplicate appointment (same doctor, date, time, patient).
   * 3. Generate appointment_no via hospital_counters.
   * 4. Create the appointment record.
   */
  async bookAppointment(dto: BookAppointmentDto, userId: number) {
    // Find patient by user_id
    const patient = await this.prisma.patients.findFirst({
      where: { user_id: userId },
    });

    if (!patient) {
      throw new NotFoundException(
        'Patient profile not found. Please complete your profile first.',
      );
    }

    // Validate doctor
    const doctor = await this.prisma.doctors.findUnique({
      where: { doctor_id: dto.doctor_id },
      include: {
        users_doctors_user_idTousers: {
          select: { full_name: true },
        },
      },
    });

    if (!doctor || !doctor.is_active) {
      throw new NotFoundException('Doctor not found or is inactive.');
    }

    if (!doctor.is_available) {
      throw new BadRequestException(
        'Doctor is currently not available for appointments.',
      );
    }

    // Validate hospital
    if (doctor.hospital_id !== dto.hospital_id) {
      throw new BadRequestException(
        'Doctor does not belong to the selected hospital.',
      );
    }

    // Parse date and time
    const [year, month, day] = dto.appointment_date.split('-').map(Number);
    const appointmentDate = new Date(Date.UTC(year, month - 1, day));

    const appointmentTime = this.parseTimeString(dto.appointment_time);

    // Check for duplicate booking
    const existingBooking = await this.prisma.appointments.findFirst({
      where: {
        patient_id: patient.patient_id,
        doctor_id: dto.doctor_id,
        appointment_date: appointmentDate,
        appointment_status: {
          in: ['Scheduled', 'Checked-In', 'Rescheduled'],
        },
        is_active: true,
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'You already have an active appointment with this doctor on the selected date.',
      );
    }

    // Generate appointment number within a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Fetch hospital_code for the appointment number
      const hospital = await tx.hospitals.findUnique({
        where: { hospital_id: dto.hospital_id },
        select: { hospital_code: true },
      });

      if (!hospital) {
        throw new NotFoundException('Hospital not found.');
      }

      const appointmentNo = await this.counterService.generateAppointmentNumber(
        tx,
        dto.hospital_id,
        appointmentDate,
        userId,
      );

      // Create appointment
      const appointment = await tx.appointments.create({
        data: {
          hospital_id: dto.hospital_id,
          patient_id: patient.patient_id,
          doctor_id: dto.doctor_id,
          appointment_no: appointmentNo,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          appointment_status: 'Scheduled',
          remarks: dto.remarks || null,
          is_active: true,
          created_by: userId,
          modified_by: userId,
        },
        include: {
          hospitals: {
            select: { hospital_name: true },
          },
          doctors: {
            include: {
              users_doctors_user_idTousers: {
                select: { full_name: true },
              },
              departments_master: {
                select: { department_name: true },
              },
              specializations: {
                select: { specialization_name: true },
              },
            },
          },
        },
      });

      return appointment;
    });

    return {
      message: 'Appointment booked successfully',
      data: {
        appointment_id: result.appointment_id,
        appointment_no: result.appointment_no,
        appointment_date: result.appointment_date.toISOString().split('T')[0],
        appointment_time: result.appointment_time,
        appointment_status: result.appointment_status,
        hospital_name: result.hospitals?.hospital_name,
        doctor_name:
          result.doctors?.users_doctors_user_idTousers?.full_name ?? null,
        department: result.doctors?.departments_master?.department_name ?? null,
        specialization:
          result.doctors?.specializations?.specialization_name ?? null,
        remarks: result.remarks,
      },
    };
  }

  /**
   * Get all appointments for the logged-in patient.
   */
  async getMyAppointments(userId: number) {
    const patient = await this.prisma.patients.findFirst({
      where: { user_id: userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    const appointments = await this.prisma.appointments.findMany({
      where: {
        patient_id: patient.patient_id,
        is_active: true,
      },
      include: {
        hospitals: {
          select: { hospital_name: true },
        },
        doctors: {
          include: {
            users_doctors_user_idTousers: {
              select: { full_name: true },
            },
            departments_master: {
              select: { department_name: true },
            },
            specializations: {
              select: { specialization_name: true },
            },
          },
        },
      },
      orderBy: { appointment_date: 'desc' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // console.log(today);

    return {
      data: appointments.map((apt) => {
        const aptDate = new Date(apt.appointment_date);
        // console.log(aptDate);
        aptDate.setHours(0, 0, 0, 0);
        const isToday = aptDate.getTime() === today.getTime();

        // Can cancel only if appointment is scheduled and > 24 hours away
        // const aptDateTime = new Date(apt.appointment_date);
        // const timeParts = this.formatTime(apt.appointment_time).split(':');
        // if (timeParts.length === 2) {
        //   aptDateTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
        // }
        // const hoursUntil =
        //   (aptDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
        // const canCancel =
        //   apt.appointment_status === 'Scheduled' && hoursUntil > 24;

        const dateStr = apt.appointment_date.toISOString().split('T')[0];
        const timeStr = this.formatTime(apt.appointment_time);

        const aptDateTime = new Date(`${dateStr}T${timeStr}:00`);

        const hoursUntil =
          (aptDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

        const canCancel =
          (apt.appointment_status === 'Scheduled' ||
            apt.appointment_status === 'Rescheduled') &&
          hoursUntil > 24;

        return {
          appointment_id: apt.appointment_id,
          appointment_no: apt.appointment_no,
          doctor_name:
            apt.doctors?.users_doctors_user_idTousers?.full_name ?? null,
          specialization:
            apt.doctors?.specializations?.specialization_name ?? null,
          hospital_name: apt.hospitals?.hospital_name ?? null,
          department: apt.doctors?.departments_master?.department_name ?? null,
          date: apt.appointment_date.toISOString().split('T')[0],
          time: this.formatTimeToAmPm(apt.appointment_time),
          status: apt.appointment_status,
          symptoms: apt.remarks,
          booking_date: apt.created_at,
          can_cancel: canCancel,
          is_today: isToday,
        };
      }),
    };
  }

  /**
   * Cancel an appointment.
   * Validates the patient owns the appointment and the >24h rule.
   */
  async cancelAppointment(appointmentId: number, userId: number) {
    const patient = await this.prisma.patients.findFirst({
      where: { user_id: userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    const appointment = await this.prisma.appointments.findUnique({
      where: { appointment_id: appointmentId },
    });

    if (!appointment || !appointment.is_active) {
      throw new NotFoundException('Appointment not found.');
    }

    if (appointment.patient_id !== patient.patient_id) {
      throw new BadRequestException(
        'You are not authorized to cancel this appointment.',
      );
    }

    if (
      appointment.appointment_status !== 'Scheduled' &&
      appointment.appointment_status !== 'Rescheduled'
    ) {
      throw new BadRequestException(
        `Cannot cancel an appointment with status: ${appointment.appointment_status}`,
      );
    }

    // Check 24-hour cancellation rule
    // const aptDateTime = new Date(appointment.appointment_date);
    // const timeParts = this.formatTime(appointment.appointment_time).split(':');
    // if (timeParts.length === 2) {
    //   aptDateTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
    // }
    const dateStr = appointment.appointment_date.toISOString().split('T')[0];
    const timeStr = this.formatTime(appointment.appointment_time);

    const aptDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const hoursUntil = (aptDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntil <= 24) {
      throw new BadRequestException(
        'Appointments can only be cancelled more than 24 hours in advance.',
      );
    }

    await this.prisma.appointments.update({
      where: { appointment_id: appointmentId },
      data: {
        appointment_status: 'Cancelled',
        modified_by: userId,
        modified_at: new Date(),
      },
    });

    return { message: 'Appointment cancelled successfully' };
  }

  /**
   * Reschedule an appointment to a new date and time.
   */
  async rescheduleAppointment(
    appointmentId: number,
    dto: RescheduleAppointmentDto,
    userId: number,
  ) {
    const patient = await this.prisma.patients.findFirst({
      where: { user_id: userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    const appointment = await this.prisma.appointments.findUnique({
      where: { appointment_id: appointmentId },
    });

    if (!appointment || !appointment.is_active) {
      throw new NotFoundException('Appointment not found.');
    }

    if (appointment.patient_id !== patient.patient_id) {
      throw new BadRequestException(
        'You are not authorized to reschedule this appointment.',
      );
    }

    if (
      appointment.appointment_status !== 'Scheduled' &&
      appointment.appointment_status !== 'Rescheduled'
    ) {
      throw new BadRequestException(
        `Cannot reschedule an appointment with status: ${appointment.appointment_status}`,
      );
    }

    const [year, month, day] = dto.appointment_date.split('-').map(Number);
    const newDate = new Date(Date.UTC(year, month - 1, day));
    const newTime = this.parseTimeString(dto.appointment_time);
    // console.log(dto.appointment_date);
    // console.log(newDate);
    // console.log(newTime);

    const updated = await this.prisma.appointments.update({
      where: { appointment_id: appointmentId },
      data: {
        appointment_date: newDate,
        appointment_time: newTime,
        appointment_status: 'Rescheduled',
        modified_by: userId,
        modified_at: new Date(),
      },
    });

    return {
      message: 'Appointment rescheduled successfully',
      data: {
        appointment_id: updated.appointment_id,
        appointment_date: updated.appointment_date.toISOString().split('T')[0],
        appointment_time: updated.appointment_time,
        appointment_status: updated.appointment_status,
      },
    };
  }

  async getTodayAppointments(hospitalId: number) {
    const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // console.log(today);

    const appointments = await this.prisma.appointments.findMany({
      where: {
        hospital_id: hospitalId,
        appointment_date: today,
        appointment_status: {
          in: ['Scheduled', 'Rescheduled'],
        },
      },

      include: {
        patients: true,
        doctors: {
          include: {
            users_doctors_user_idTousers: true,
          },
        },
      },
    });

    const data = appointments.map((a) => ({
      id: a.appointment_id,
      appointmentNo: a.appointment_no,
      patientId: a.patient_id,
      doctorId: a.doctor_id,
      date: a.appointment_date,
      time: a.appointment_time,
      status: a.appointment_status,
    }));

    return { data };
  }

  async getAppointmentDetails(appointmentId: number) {
    const appointment = await this.prisma.appointments.findFirst({
      where: {
        appointment_id: appointmentId,
        // is_deleted: false,
      },
      select: {
        appointment_id: true,
        appointment_no: true,
        hospital_id: true,
        patient_id: true,
        doctor_id: true,
        appointment_date: true,
        appointment_time: true,
        appointment_status: true,

        patients: {
          select: {
            patient_id: true,
            full_name: true,
          },
        },

        doctors: {
          select: {
            doctor_id: true,
            users_doctors_user_idTousers: {
              select: {
                full_name: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return {
      id: appointment.appointment_id,
      appointmentNo: appointment.appointment_no,
      date: appointment.appointment_date,
      time: this.formatTimeToAmPm(appointment.appointment_time),
      status: appointment.appointment_status,
      patient: appointment.patients,
      doctor: {
        id: appointment.doctors.doctor_id,
        name: appointment.doctors.users_doctors_user_idTousers.full_name,
      },
    };
  }

  // ─── Helper Methods ───────────────────────────────────────────

  /**
   * Generate 30-minute time slots between start and end time.
   */
  private generateTimeSlots(startTime: Date, endTime: Date): string[] {
    const slots: string[] = [];
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Extract hours and minutes
    const startHour = start.getUTCHours();
    const startMin = start.getUTCMinutes();
    const endHour = end.getUTCHours();
    const endMin = end.getUTCMinutes();

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const h = String(currentHour).padStart(2, '0');
      const m = String(currentMin).padStart(2, '0');
      slots.push(`${h}:${m}`);

      // Increment by 30 minutes
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    return slots;
  }

  /**
   * Format a Date (Time) column to HH:mm string.
   */
  private formatTime(time: Date): string {
    const d = new Date(time);
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  /**
   * Format a Date (Time) to 12-hour AM/PM string for frontend display.
   */
  private formatTimeToAmPm(time: Date): string {
    const d = new Date(time);
    let hours = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  /**
   * Parse a time string like "09:00" or "09:00 AM" into a Date for the
   * appointment_time column (Prisma Time type).
   */
  private parseTimeString(timeStr: string): Date {
    // Remove AM/PM and parse
    const cleaned = timeStr.replace(/\s*(AM|PM)\s*/i, '').trim();
    const parts = cleaned.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1] || '0', 10);

    // Handle AM/PM conversion
    if (/PM/i.test(timeStr) && hours < 12) {
      hours += 12;
    } else if (/AM/i.test(timeStr) && hours === 12) {
      hours = 0;
    }

    // Prisma Time columns use a Date with the time portion
    const date = new Date('1970-01-01T00:00:00.000Z');
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
  }
}
