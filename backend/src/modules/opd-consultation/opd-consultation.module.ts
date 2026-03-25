import { Module } from '@nestjs/common';
import { OpdConsultationController } from './opd-consultation.controller';
import { OpdConsultationService } from './opd-consultation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [OpdConsultationController],
  providers: [OpdConsultationService],
  exports: [OpdConsultationService],
})
export class OpdConsultationModule {}
