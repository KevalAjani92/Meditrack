import { Module } from '@nestjs/common';
import { DoctorsAdminService } from './doctors.service';
import { DoctorsAdminController } from './doctors.controller';
import { DoctorOpdController } from './doctor-opd/doctor-opd.controller';
import { DoctorOpdService } from './doctor-opd/doctor-opd.service';

@Module({
  controllers: [DoctorsAdminController, DoctorOpdController],
  providers: [DoctorsAdminService, DoctorOpdService],
})
export class DoctorsAdminModule {}
