import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorOpdListDto } from '../dto/doctor-opd-list.dto';
import { DoctorAppointmentsQueryDto } from '../dto/doctor-appointments-query.dto';
import { Prisma } from 'generated/prisma/client';
import { DoctorWeekSummaryDto } from '../dto/doctor-week-summary.dto';
import { OpdQueueQueryDto } from '../dto/opd-queue-query.dto';

@Injectable()
export class DoctorOpdService {
  constructor(private prisma: PrismaService) {}

  async getOpdDoctors(query: DoctorOpdListDto) {
    const today = new Date();
    // today.setHours(0, 0, 0, 0);

    const doctors = await this.prisma.doctors.findMany({
      where: {
        hospital_id: query.hospitalId,
        // department_id: query.department_id,
        is_active: true,
      },

      include: {
        users_doctors_user_idTousers: true,
        departments_master: true,
        daily_queues: {
          where: {
            queue_date: today,
          },
          include: {
            queue_tokens: {
              where: {
                status: 'Waiting',
              },
            },
          },
        },
      },
    });

    const data = doctors.map((d) => {
      const queue = d.daily_queues[0];

      return {
        id: d.doctor_id,
        name: d.users_doctors_user_idTousers.full_name,
        department: d.departments_master.department_name,
        queueCount: queue?.queue_tokens.length || 0,
        status: d.is_available ? 'Active' : 'Closed',
      };
    });

    return { data };
  }

  async getDoctorQueueStatus(doctorId: number) {
    const today = new Date();
    // today.setHours(0, 0, 0, 0);

    const queue = await this.prisma.daily_queues.findFirst({
      where: {
        doctor_id: doctorId,
        queue_date: today,
      },

      include: {
        queue_tokens: {
          where: {
            status: 'Waiting',
          },
        },
      },
    });

    const doctor = await this.prisma.doctors.findUnique({
      where: { doctor_id: doctorId },
    });
    if (!doctor) {
      throw new BadRequestException('Invalid Doctor');
    }

    return {
      doctor_id: doctorId,
      status: doctor.is_available ? 'Active' : 'Closed',
      queueCount: queue?.queue_tokens.length || 0,
    };
  }

  async getDoctorAppointments(
    query: DoctorAppointmentsQueryDto,
    userId: number,
  ) {
    const { date, page = 1, limit = 8, search, status, time } = query;

    const doctor = await this.prisma.doctors.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!doctor) {
      throw new BadRequestException('Doctor Not Found');
    }
    const doctorId = doctor.doctor_id;

    const skip = (page - 1) * limit;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    let timeFilter: Prisma.appointmentsWhereInput = {};

    if (time && time !== 'All') {
      if (time === 'Morning') {
        timeFilter = {
          appointment_time: {
            gte: new Date('1970-01-01T06:00:00Z'),
            lt: new Date('1970-01-01T12:00:00Z'),
          },
        };
      }

      if (time === 'Afternoon') {
        timeFilter = {
          appointment_time: {
            gte: new Date('1970-01-01T12:00:00Z'),
            lt: new Date('1970-01-01T17:00:00Z'),
          },
        };
      }

      if (time === 'Evening') {
        timeFilter = {
          appointment_time: {
            gte: new Date('1970-01-01T17:00:00Z'),
            lt: new Date('1970-01-01T21:00:00Z'),
          },
        };
      }
    }

    const where: Prisma.appointmentsWhereInput = {
      doctor_id: doctorId,

      appointment_date: {
        gte: start,
        lte: end,
      },
      ...timeFilter,

      ...(status &&
        status !== 'All' && {
          appointment_status: status,
        }),

      ...(search && {
        OR: [
          {
            patients: {
              full_name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            appointment_no: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            patients: {
              patient_contact_details: {
                phone_number: {
                  contains: search,
                },
              },
            },
          },
        ],
      }),
    };

    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointments.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          appointment_time: 'asc',
        },

        include: {
          patients: {
            include: {
              patient_contact_details: true,
              patient_medical_details: {
                include: {
                  blood_groups: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.appointments.count({ where }),
    ]);

    const data = appointments.map((a) => {
      const dob = new Date(a.patients.dob);
      const age = new Date().getFullYear() - dob.getFullYear();

      return {
        id: a.appointment_id,

        appointmentNo: a.appointment_no,

        patientName: a.patients.full_name,

        patientId: a.patients.patient_no,

        age,

        gender: a.patients.gender,

        date: a.appointment_date,

        time: this.formatTimeToAmPm(a.appointment_time),

        chiefComplaint: a.remarks,

        status: a.appointment_status,

        phone: a.patients.patient_contact_details?.phone_number,

        city: '',

        medicalInfo: {
          bloodGroup:
            a.patients.patient_medical_details?.blood_groups?.blood_group_name,

          allergies: a.patients.patient_medical_details?.allergies,

          chronicConditions:
            a.patients.patient_medical_details?.chronic_conditions,

          currentMedications:
            a.patients.patient_medical_details?.current_medications,
        },
      };
    });

    /* ---------- Stats ---------- */

    const statsRaw = await this.prisma.appointments.groupBy({
      by: ['appointment_status'],

      where: {
        doctor_id: doctorId,
        appointment_date: {
          gte: start,
          lte: end,
        },
      },

      _count: {
        appointment_id: true,
      },
    });

    const stats = {
      total: 0,
      waiting: 0,
      checkedIn: 0,
      completed: 0,
      cancelledNoShow: 0,
    };

    statsRaw.forEach((s) => {
      stats.total += s._count.appointment_id;

      if (s.appointment_status === 'Waiting')
        stats.waiting = s._count.appointment_id;

      if (s.appointment_status === 'Checked-In')
        stats.checkedIn = s._count.appointment_id;

      if (s.appointment_status === 'Completed')
        stats.completed = s._count.appointment_id;

      if (['Cancelled', 'No-Show'].includes(s.appointment_status))
        stats.cancelledNoShow += s._count.appointment_id;
    });

    return {
      data: {
        data,

        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },

        stats,
      },
    };
  }

  async getDoctorWeekSummary(query: DoctorWeekSummaryDto, userId: number) {
    const { weekStart } = query;

    const doctor = await this.prisma.doctors.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!doctor) {
      throw new BadRequestException('Doctor Not Found');
    }
    const doctorId = doctor.doctor_id;

    const start = new Date(weekStart);
    // start.setHours(0, 0, 0, 0);

    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    // Get appointments for the week
    const appointments = await this.prisma.appointments.groupBy({
      by: ['appointment_date'],
      where: {
        doctor_id: doctorId,
        appointment_date: {
          gte: start,
          lte: end,
        },
      },
      _count: {
        appointment_id: true,
      },
    });

    // Doctor slot capacity
    const availability = await this.prisma.doctor_availability.findMany({
      where: {
        doctor_id: doctorId,
      },
    });

    const availabilityMap = new Map(
      availability.map((a) => [a.day_of_week, a.max_appointments]),
    );

    const result: any = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const iso = date.toISOString().split('T')[0];

      const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

      const totalSlots = availabilityMap.get(dayOfWeek) || 0;

      const booked =
        appointments.find(
          (a) => a.appointment_date.toISOString().split('T')[0] === iso,
        )?._count.appointment_id || 0;

      result.push({
        date: iso,
        totalSlots,
        bookedSlots: booked,
        availableSlots: totalSlots - booked,
      });
    }

    return {
      data: result,
    };
  }

  async getDoctorQueue(userId: number, query: OpdQueueQueryDto) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { user_id: userId },
    });

    if (!doctor) throw new NotFoundException('Doctor profile not found');

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const todayStart = new Date();
    // todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const where: any = {
      daily_queues: {
        doctor_id: doctor.doctor_id,
        queue_date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },

      ...(query.status &&
        query.status !== 'All' && {
          status: query.status,
        }),

      ...(query.type &&
        query.type !== 'All' && {
          visit_type: query.type,
        }),

      ...(query.search && {
        OR: [
          {
            patients: {
              full_name: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
          {
            token_number: {
              equals: Number(query.search) || undefined,
            },
          },
        ],
      }),
    };

    const [tokens, total] = await this.prisma.$transaction([
      this.prisma.queue_tokens.findMany({
        where,

        skip,
        take: limit,

        orderBy: [
          { daily_queues: { queue_date: 'asc' } },
          { token_number: 'asc' },
        ],

        include: {
          daily_queues: true,

          opd_visits: {
            include: {
              appointments: true,
              patients: {
                include: {
                  patient_contact_details: true,
                  patient_medical_details: {
                    include: {
                      blood_groups: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),

      this.prisma.queue_tokens.count({ where }),
    ]);

    const data = tokens.map((t) => {
      const patient = t.opd_visits?.patients;

      const dob = patient?.dob;
      const age = dob
        ? new Date().getFullYear() - new Date(dob).getFullYear()
        : null;

      const waitTime = Math.floor((Date.now() - t.issued_at.getTime()) / 60000);

      let visitType = 'Walk-In';

      if (t.opd_visits?.appointment_id) visitType = 'Appointment';

      if (t.opd_visits?.is_emergency) visitType = 'Emergency';

      return {
        id: t.token_id,

        tokenNo: t.token_number,

        opdId: t.opd_id,

        patientName: patient?.full_name,

        age: age,

        gender: patient?.gender,

        visitType: visitType,

        apptNo: t.opd_visits?.appointments?.appointment_no ?? null,

        chiefComplaint: t.opd_visits?.chief_complaint,

        issueTime: this.formatTimeToAmPm(t.issued_at),

        waitTimeMins: waitTime,

        status: t.status,

        isEmergency: t.opd_visits?.is_emergency,

        medicalInfo: {
          bloodGroup:
            patient?.patient_medical_details?.blood_groups?.blood_group_name,
          allergies: patient?.patient_medical_details?.allergies,
          chronicConditions:
            patient?.patient_medical_details?.chronic_conditions,
          lastVisit: t.opd_visits?.visit_datetime ?? null,
        },
      };
    });

    const statsRaw = await this.prisma.queue_tokens.groupBy({
      by: ['status'],

      where: {
        daily_queues: {
          doctor_id: doctor.doctor_id,
          queue_date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      },

      _count: {
        status: true,
      },
    });

    let waiting = 0;
    let inProgress = 0;
    let completed = 0;

    statsRaw.forEach((s) => {
      if (s.status === 'Waiting') waiting = s._count.status;
      if (s.status === 'In Progress') inProgress = s._count.status;
      if (s.status === 'Completed') completed = s._count.status;
    });

    const waitTimes = data.reduce((sum, d) => sum + d.waitTimeMins, 0);

    return {
      data: {
        data,

        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },

        stats: {
          total,
          waiting,
          inProgress,
          completed,
          waitTimes,
          avgWait: total ? Math.round(waitTimes / total) : 0,
        },
      },
    };
  }

  async getDoctorPerformance(userId: number) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { user_id: userId },
    });

    if (!doctor) throw new NotFoundException('Doctor not found');

    const completed = await this.prisma.queue_tokens.findMany({
      where: {
        status: 'Completed',
        daily_queues: {
          doctor_id: doctor.doctor_id,
        },
      },
    });

    const patientsSeen = completed.length;

    let consultSum = 0;
    let longestWait = 0;

    completed.forEach((t) => {
      if (t.started_at && t.completed_at) {
        const consult =
          (t.completed_at.getTime() - t.started_at.getTime()) / 60000;

        consultSum += consult;
      }

      if (t.started_at) {
        const wait = (t.started_at.getTime() - t.issued_at.getTime()) / 60000;

        if (wait > longestWait) longestWait = wait;
      }
    });

    return {
      patientsSeen,

      avgConsultTime: patientsSeen ? Math.round(consultSum / patientsSeen) : 0,

      longestWait: Math.round(longestWait),
    };
  }

  // async getQueueTimeline(userId: number) {
  //   const doctor = await this.prisma.doctors.findUnique({
  //     where: { user_id: userId },
  //   });

  //   if (!doctor) throw new NotFoundException('Doctor not found');

  //   const events = await this.prisma.queue_events.findMany({
  //     where: {
  //       doctor_id: doctor.doctor_id,
  //     },

  //     orderBy: {
  //       created_at: 'desc',
  //     },

  //     take: 20,
  //   });

  //   return {
  //     data: events.map((e) => ({
  //       id: e.event_id,
  //       time: this.formatTimeToAmPm(e.created_at),
  //       message: e.message,
  //       type: e.event_type,
  //     })),
  //   };
  // }

  private formatTimeToAmPm(time: Date): string {
    const d = new Date(time);
    let hours = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
}
