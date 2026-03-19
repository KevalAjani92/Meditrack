import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CounterService {
  constructor(private prisma: PrismaService) {}

  async generatePatientNumber(
    tx: Prisma.TransactionClient,
    hospitalGroupId: number,
    createdBy: number,
  ): Promise<string> {
    const group = await tx.hospital_groups.findUnique({
      where: { hospital_group_id: hospitalGroupId },
    });

    if (!group) {
      throw new Error('Hospital group not found');
    }

    const year = new Date().getFullYear();

    await tx.$executeRaw`
      SELECT counter_id
      FROM hospital_counters
      WHERE hospital_group_id = ${hospitalGroupId}
      AND counter_type = 'PATIENT_NO'
      FOR UPDATE
    `;

    let counter = await tx.hospital_counters.findFirst({
      where: {
        hospital_group_id: hospitalGroupId,
        counter_type: 'PATIENT_NO',
      },
    });

    if (!counter) {
      counter = await tx.hospital_counters.create({
        data: {
          hospital_group_id: hospitalGroupId,
          counter_type: 'PATIENT_NO',
          prefix: `PAT-${group.group_code}`,
          current_value: 0,
          reset_policy: 'YEARLY',
          created_by: createdBy,
          modified_by: createdBy,
          last_reset_date: new Date(),
        },
      });
    }

    let nextValue = counter.current_value + 1;

    if (counter.reset_policy === 'YEARLY') {
      const lastYear = counter.last_reset_date?.getFullYear();

      if (!lastYear || lastYear !== year) {
        nextValue = 1;
      }
    }

    await tx.hospital_counters.update({
      where: { counter_id: counter.counter_id },
      data: {
        current_value: nextValue,
        last_reset_date: new Date(),
        modified_by: createdBy,
      },
    });

    const sequence = String(nextValue).padStart(5, '0');

    return `PAT-${group.group_code}-${year}-${sequence}`;
  }

  async generateOpdNumber(
    tx: Prisma.TransactionClient,
    hospitalId: number,
    createdBy: number,
  ): Promise<string> {
    const hospital = await tx.hospitals.findUnique({
      where: { hospital_id: hospitalId },
      select: { hospital_code: true, hospital_group_id: true },
    });

    if (!hospital) {
      throw new Error('Hospital not found');
    }

    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // 🔒 Lock counter row
    await tx.$executeRaw`
    SELECT counter_id
    FROM hospital_counters
    WHERE hospital_id = ${hospitalId}
    AND counter_type = 'OPD_NO'
    FOR UPDATE
  `;

    let counter = await tx.hospital_counters.findFirst({
      where: {
        hospital_id: hospitalId,
        counter_type: 'OPD_NO',
      },
    });

    if (!counter) {
      counter = await tx.hospital_counters.create({
        data: {
          hospital_group_id: hospital.hospital_group_id,
          hospital_id: hospitalId,
          counter_type: 'OPD_NO',
          prefix: `OPD-${hospital.hospital_code}`,
          current_value: 0,
          reset_policy: 'DAILY',
          created_by: createdBy,
          modified_by: createdBy,
          last_reset_date: today,
        },
      });
    }

    let nextValue = counter.current_value + 1;

    // DAILY RESET
    if (counter.reset_policy === 'DAILY') {
      const lastReset = counter.last_reset_date
        ? counter.last_reset_date.toISOString().split('T')[0]
        : null;

      if (!lastReset || lastReset !== todayDate) {
        nextValue = 1;
      }
    }

    await tx.hospital_counters.update({
      where: { counter_id: counter.counter_id },
      data: {
        current_value: nextValue,
        last_reset_date: today,
        modified_by: createdBy,
      },
    });

    const sequence = String(nextValue).padStart(4, '0');

    const datePart = todayDate.replace(/-/g, '');

    return `OPD-${hospital.hospital_code}-${datePart}-${sequence}`;
  }

  async generateAppointmentNumber(
    tx: Prisma.TransactionClient,
    hospitalId: number,
    appointmentDate: Date,
    createdBy: number,
  ): Promise<string> {
    const hospital = await tx.hospitals.findUnique({
      where: { hospital_id: hospitalId },
      select: { hospital_code: true, hospital_group_id: true },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const today = appointmentDate;
    const datePart = today.toISOString().split('T')[0];
    const formattedDate = datePart.replace(/-/g, '');

    // Lock row for concurrency safety
    await tx.$executeRaw`
    SELECT counter_id
    FROM hospital_counters
    WHERE hospital_id = ${hospitalId}
    AND counter_type = 'APPOINTMENT'
    FOR UPDATE
  `;

    let counter = await tx.hospital_counters.findFirst({
      where: {
        hospital_id: hospitalId,
        counter_type: 'APPOINTMENT',
        is_active: true,
      },
    });

    if (!counter) {
      counter = await tx.hospital_counters.create({
        data: {
          hospital_group_id: hospital.hospital_group_id,
          hospital_id: hospitalId,
          counter_type: 'APPOINTMENT',
          prefix: 'APT',
          current_value: 0,
          reset_policy: 'DAILY',
          is_active: true,
          created_by: createdBy,
          modified_by: createdBy,
          last_reset_date: today,
        },
      });
    }

    let nextValue = counter.current_value + 1;

    if (counter.reset_policy === 'DAILY') {
      const lastReset = counter.last_reset_date
        ? counter.last_reset_date.toISOString().split('T')[0]
        : null;

      if (!lastReset || lastReset !== datePart) {
        nextValue = 1;
      }
    }

    await tx.hospital_counters.update({
      where: { counter_id: counter.counter_id },
      data: {
        current_value: nextValue,
        last_reset_date: today,
        modified_by: createdBy,
      },
    });

    const sequence = String(nextValue).padStart(4, '0');

    return `APT-${hospital.hospital_code}-${formattedDate}-${sequence}`;
  }
}
