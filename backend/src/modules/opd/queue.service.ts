import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class QueueService {
  async getOrCreateDailyQueue(
    tx: Prisma.TransactionClient,
    hospitalId: number,
    doctorId: number,
    userId: number,
  ) {
    const today = new Date();

    return tx.daily_queues.upsert({
      where: {
        hospital_id_doctor_id_queue_date: {
          hospital_id: hospitalId,
          doctor_id: doctorId,
          queue_date: today,
        },
      },
      create: {
        hospital_id: hospitalId,
        doctor_id: doctorId,
        queue_date: today,
        status: 'Active',
        created_by: userId,
        modified_by: userId,
      },
      update: {},
    });
  }

  async createQueueToken(
    tx: Prisma.TransactionClient,
    queueId: number,
    opdId: number,
    skipQueue: boolean,
  ) {
    const lastToken = await tx.queue_tokens.aggregate({
      where: { daily_queue_id: queueId },
      _max: { token_number: true },
    });

    const nextToken = (lastToken._max.token_number || 0) + 1;

    const token = await tx.queue_tokens.create({
      data: {
        daily_queue_id: queueId,
        opd_id: opdId,
        token_number: nextToken,
        status: skipQueue ? 'Priority' : 'Waiting',
      },
    });

    return token;
  }
}
