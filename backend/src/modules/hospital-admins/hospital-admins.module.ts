import { Module } from '@nestjs/common';
import { HospitalAdminsService } from './hospital-admins.service';
import { HospitalAdminsController } from './hospital-admins.controller';

@Module({
  controllers: [HospitalAdminsController],
  providers: [HospitalAdminsService],
})
export class HospitalAdminsModule {}
