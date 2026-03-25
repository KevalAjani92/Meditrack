import { Module } from '@nestjs/common';
import { DoctorOpdController } from './doctor-opd.controller';
import { DoctorOpdService } from './doctor-opd.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [DoctorOpdController],
  providers: [DoctorOpdService],
  exports: [DoctorOpdService],
})
export class DoctorOpdModule {}
