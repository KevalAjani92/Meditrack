import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryQueueDto } from './dto/query-queue.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class DoctorOpdService {
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

  private async getTodayQueue(doctorId: number, hospitalId: number) {
    const today = new Date();
    // today.setHours(0, 0, 0, 0);

    let dailyQueue = await this.prisma.daily_queues.findFirst({
      where: {
        doctor_id: doctorId,
        hospital_id: hospitalId,
        queue_date: today,
      },
    });

    return dailyQueue;
  }

  private formatTimeToAmPm(date: Date): string {
    const d = new Date(date);
    let hours = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  // ─── Get Queue ───────────────────────────────────────────────

  async getQueue(userId: number, query: QueryQueueDto) {
    const doctor = await this.getDoctorByUserId(userId);
    const dailyQueue = await this.getTodayQueue(
      doctor.doctor_id,
      doctor.hospital_id,
    );

    if (!dailyQueue) {
      return {
        data: {
          data: [],
          pagination: { page: 1, limit: query.limit, total: 0, totalPages: 0 },
        },
      };
    }
    // Build where clause for queue_tokens
    const where: any = {
      daily_queue_id: dailyQueue.daily_queue_id,
    };

    // Status filter
    if (query.status && query.status !== 'All') {
      if (query.status === 'Skipped') {
        // Frontend treats Skipped as both Skipped and "No-Show" tokens
        where.status = 'Skipped';
      } else {
        where.status = query.status;
      }
    }

    // Get all tokens with related data
    const tokens = await this.prisma.queue_tokens.findMany({
      where,
      include: {
        opd_visits: {
          include: {
            patients: {
              include: {
                patient_medical_details: {
                  include: { blood_groups: true },
                },
              },
            },
            appointments: true,
          },
        },
      },
      orderBy: [{ token_number: 'asc' }],
    });

    // Transform + apply client-side filters (search, type) that require joins
    let result = tokens
      .map((token) => {
        const opd = token.opd_visits;
        const patient = opd?.patients;
        const medical = patient?.patient_medical_details;
        const appointment = opd?.appointments;

        // Determine visit type
        let visitType: string = 'Walk-In';
        if (opd?.is_emergency) {
          visitType = 'Emergency';
        } else if (appointment) {
          visitType = 'Appointment';
        }

        // Determine if this is a no-show (token skipped + appointment no-show)
        const isNoShow =
          token.status === 'Skipped' &&
          appointment?.appointment_status === 'No-Show';

        // Calculate wait time in minutes
        let waitTimeMins = 0;
        if (token.status === 'Waiting') {
          waitTimeMins = Math.round(
            (Date.now() - new Date(token.issued_at).getTime()) / 60000,
          );
        }

        return {
          id: token.token_id,
          tokenNo: `T-${String(token.token_number).padStart(2, '0')}`,
          opdId: opd?.opd_id ?? null,
          patientName: patient?.full_name ?? 'Unknown',
          age: patient
            ? Math.floor(
                (Date.now() - new Date(patient.dob).getTime()) /
                  (365.25 * 24 * 60 * 60 * 1000),
              )
            : 0,
          gender: patient?.gender ?? '',
          visitType,
          apptNo: appointment?.appointment_no ?? undefined,
          chiefComplaint: opd?.chief_complaint ?? '',
          issueTime: this.formatTimeToAmPm(token.issued_at),
          waitTimeMins,
          status: isNoShow ? 'No-Show' : token.status,
          isEmergency: opd?.is_emergency ?? false,
          medicalInfo: {
            bloodGroup: medical?.blood_groups?.blood_group_name ?? 'Unknown',
            allergies: medical?.allergies ?? 'None',
            chronicConditions: medical?.chronic_conditions ?? 'None',
            lastVisit: 'N/A', // Will be computed below if needed
          },
        };
      })
      .filter((t) => {
        // Search filter
        if (query.search) {
          const s = query.search.toLowerCase();
          const matchName = t.patientName.toLowerCase().includes(s);
          const matchToken = t.tokenNo.toLowerCase().includes(s);
          const matchAppt = t.apptNo?.toLowerCase().includes(s) ?? false;
          if (!matchName && !matchToken && !matchAppt) return false;
        }

        // Visit type filter
        if (query.type && query.type !== 'All') {
          if (t.visitType !== query.type) return false;
        }

        return true;
      });

    // Pagination
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = result.slice((page - 1) * limit, page * limit);
    return {
      data: {
        data: paginated,
        pagination: { page, limit, total, totalPages },
      },
    };
  }

  // ─── Get Stats ───────────────────────────────────────────────

  async getStats(userId: number) {
    const doctor = await this.getDoctorByUserId(userId);
    const dailyQueue = await this.getTodayQueue(
      doctor.doctor_id,
      doctor.hospital_id,
    );

    if (!dailyQueue) {
      return {
        data: {
          total: 0,
          waiting: 0,
          inProgress: 0,
          completed: 0,
          skipped: 0,
          avgWaitMins: 0,
          queueStatus: 'Closed',
          openedAt: null,
        },
      };
    }

    const tokens = await this.prisma.queue_tokens.findMany({
      where: { daily_queue_id: dailyQueue.daily_queue_id },
    });

    const total = tokens.length;
    const waiting = tokens.filter((t) => t.status === 'Waiting').length;
    const inProgress = tokens.filter((t) => t.status === 'In Progress').length;
    const completed = tokens.filter((t) => t.status === 'Completed').length;
    const skipped = tokens.filter((t) => t.status === 'Skipped').length;

    // Calculate avg wait for waiting tokens
    const waitingTokens = tokens.filter((t) => t.status === 'Waiting');
    const avgWaitMins =
      waitingTokens.length > 0
        ? Math.round(
            waitingTokens.reduce(
              (sum, t) =>
                sum + (Date.now() - new Date(t.issued_at).getTime()) / 60000,
              0,
            ) / waitingTokens.length,
          )
        : 0;

    return {
      data: {
        total,
        waiting,
        inProgress,
        completed,
        skipped,
        avgWaitMins,
        queueStatus: dailyQueue.status,
        openedAt: this.formatTimeToAmPm(dailyQueue.opened_at),
      },
    };
  }

  // ─── Call Next ───────────────────────────────────────────────

  async callNext(userId: number, tokenId: number) {
    const doctor = await this.getDoctorByUserId(userId);

    const token = await this.prisma.queue_tokens.findUnique({
      where: { token_id: tokenId },
      include: {
        daily_queues: true,
        opd_visits: { include: { appointments: true } },
      },
    });

    if (!token) throw new NotFoundException('Token not found.');

    // Validate token belongs to this doctor's queue
    if (token.daily_queues.doctor_id !== doctor.doctor_id) {
      throw new BadRequestException('Token does not belong to your queue.');
    }

    if (token.status !== 'Waiting') {
      throw new BadRequestException(
        `Cannot call a token with status: ${token.status}`,
      );
    }

    // Transaction: update token, daily_queues current_token, appointment status
    await this.prisma.$transaction(async (tx) => {
      // Set any existing "In Progress" token back to "Waiting" (safety)
      await tx.queue_tokens.updateMany({
        where: {
          daily_queue_id: token.daily_queue_id,
          status: 'In Progress',
        },
        data: { status: 'Waiting' },
      });

      // Update this token to "In Progress"
      await tx.queue_tokens.update({
        where: { token_id: tokenId },
        data: {
          status: 'In Progress',
          started_at: new Date(),
        },
      });

      // Update daily queue current token
      await tx.daily_queues.update({
        where: { daily_queue_id: token.daily_queue_id },
        data: {
          current_token: token.token_number,
          modified_by: userId,
          modified_at: new Date(),
        },
      });

      // Update appointment status if linked
      if (token.opd_visits?.appointment_id) {
        await tx.appointments.update({
          where: { appointment_id: token.opd_visits.appointment_id },
          data: {
            appointment_status: 'Waiting',
            modified_by: userId,
            modified_at: new Date(),
          },
        });
      }
    });

    // Emit real-time event
    this.eventsGateway.emitQueueUpdate(doctor.doctor_id, {
      event: 'call-next',
      tokenId,
    });

    return { message: 'Patient called successfully.' };
  }

  // ─── Skip Token ──────────────────────────────────────────────

  async skipToken(userId: number, tokenId: number) {
    const doctor = await this.getDoctorByUserId(userId);

    const token = await this.prisma.queue_tokens.findUnique({
      where: { token_id: tokenId },
      include: { daily_queues: true },
    });

    if (!token) throw new NotFoundException('Token not found.');

    if (token.daily_queues.doctor_id !== doctor.doctor_id) {
      throw new BadRequestException('Token does not belong to your queue.');
    }

    if (token.status !== 'Waiting' && token.status !== 'In Progress') {
      throw new BadRequestException(
        `Cannot skip a token with status: ${token.status}`,
      );
    }

    await this.prisma.queue_tokens.update({
      where: { token_id: tokenId },
      data: {
        status: 'Skipped',
        completed_at: new Date(),
      },
    });

    // Emit real-time event
    this.eventsGateway.emitQueueUpdate(doctor.doctor_id, {
      event: 'skip',
      tokenId,
    });

    return { message: 'Token skipped successfully.' };
  }

  // ─── No-Show ─────────────────────────────────────────────────

  async markNoShow(userId: number, tokenId: number) {
    const doctor = await this.getDoctorByUserId(userId);

    const token = await this.prisma.queue_tokens.findUnique({
      where: { token_id: tokenId },
      include: {
        daily_queues: true,
        opd_visits: { include: { appointments: true } },
      },
    });

    if (!token) throw new NotFoundException('Token not found.');

    if (token.daily_queues.doctor_id !== doctor.doctor_id) {
      throw new BadRequestException('Token does not belong to your queue.');
    }

    if (token.status !== 'Waiting' && token.status !== 'In Progress') {
      throw new BadRequestException(
        `Cannot mark no-show for a token with status: ${token.status}`,
      );
    }

    // Transaction: update token status to Skipped (DB constraint), appointment to No-Show
    await this.prisma.$transaction(async (tx) => {
      await tx.queue_tokens.update({
        where: { token_id: tokenId },
        data: {
          status: 'Skipped',
          completed_at: new Date(),
        },
      });

      // Update appointment status to No-Show if linked
      if (token.opd_visits?.appointment_id) {
        await tx.appointments.update({
          where: { appointment_id: token.opd_visits.appointment_id },
          data: {
            appointment_status: 'No-Show',
            modified_by: userId,
            modified_at: new Date(),
          },
        });
      }
    });

    // Emit real-time event
    this.eventsGateway.emitQueueUpdate(doctor.doctor_id, {
      event: 'no-show',
      tokenId,
    });

    return { message: 'Token marked as No-Show.' };
  }

  // ─── Performance ─────────────────────────────────────────────

  async getPerformance(userId: number) {
    const doctor = await this.getDoctorByUserId(userId);
    const dailyQueue = await this.getTodayQueue(
      doctor.doctor_id,
      doctor.hospital_id,
    );

    if (!dailyQueue) {
      return {
        data: {
          patientsSeen: 0,
          avgConsultMins: 0,
          longestWaitMins: 0,
        },
      };
    }

    const tokens = await this.prisma.queue_tokens.findMany({
      where: { daily_queue_id: dailyQueue.daily_queue_id },
    });

    const completedTokens = tokens.filter((t) => t.status === 'Completed');
    const patientsSeen = completedTokens.length;

    // Average consultation time (completed_at - started_at)
    let avgConsultMins = 0;
    if (completedTokens.length > 0) {
      const totalConsultMs = completedTokens.reduce((sum, t) => {
        if (t.started_at && t.completed_at) {
          return (
            sum +
            (new Date(t.completed_at).getTime() -
              new Date(t.started_at).getTime())
          );
        }
        return sum;
      }, 0);
      avgConsultMins = Math.round(
        totalConsultMs / completedTokens.length / 60000,
      );
    }

    // Longest wait (for waiting tokens)
    const waitingTokens = tokens.filter((t) => t.status === 'Waiting');
    let longestWaitMins = 0;
    if (waitingTokens.length > 0) {
      longestWaitMins = Math.round(
        Math.max(
          ...waitingTokens.map(
            (t) => (Date.now() - new Date(t.issued_at).getTime()) / 60000,
          ),
        ),
      );
    }

    return {
      data: {
        patientsSeen,
        avgConsultMins,
        longestWaitMins,
      },
    };
  }

  // ─── Timeline ────────────────────────────────────────────────

  async getTimeline(userId: number) {
    const doctor = await this.getDoctorByUserId(userId);
    const dailyQueue = await this.getTodayQueue(
      doctor.doctor_id,
      doctor.hospital_id,
    );

    if (!dailyQueue) {
      return { data: [] };
    }

    const tokens = await this.prisma.queue_tokens.findMany({
      where: { daily_queue_id: dailyQueue.daily_queue_id },
      include: {
        opd_visits: {
          include: {
            patients: { select: { full_name: true } },
          },
        },
      },
      orderBy: { token_number: 'asc' },
    });

    const events: Array<{
      id: string;
      time: string;
      message: string;
      type: string;
    }> = [];

    // Queue opened event
    events.push({
      id: `sys-open`,
      time: this.formatTimeToAmPm(dailyQueue.opened_at),
      message: 'Queue Opened',
      type: 'System',
    });

    for (const token of tokens) {
      const tokenLabel = `T-${String(token.token_number).padStart(2, '0')}`;
      const patientName = token.opd_visits?.patients?.full_name ?? 'Patient';

      if (token.started_at) {
        events.push({
          id: `start-${token.token_id}`,
          time: this.formatTimeToAmPm(token.started_at),
          message: `Token ${tokenLabel} Started — ${patientName}`,
          type: 'Start',
        });
      }

      if (token.completed_at) {
        if (token.status === 'Completed') {
          events.push({
            id: `complete-${token.token_id}`,
            time: this.formatTimeToAmPm(token.completed_at),
            message: `Token ${tokenLabel} Completed — ${patientName}`,
            type: 'Complete',
          });
        } else if (token.status === 'Skipped') {
          events.push({
            id: `skip-${token.token_id}`,
            time: this.formatTimeToAmPm(token.completed_at),
            message: `Token ${tokenLabel} Skipped — ${patientName}`,
            type: 'Skip',
          });
        }
      }
    }

    // Sort by time descending (newest first)
    events.sort((a, b) => {
      // Simple sort by event id (order of creation handles this mostly)
      return 0; // Events are already in chronological order, reverse for newest first
    });

    return { data: events.reverse() };
  }
}
