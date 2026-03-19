import { Module } from '@nestjs/common';
import { ReceptionistsAdminService } from './receptionists.service';
import { ReceptionistsAdminController } from './receptionists.controller';

@Module({
  controllers: [ReceptionistsAdminController],
  providers: [ReceptionistsAdminService],
})
export class ReceptionistsAdminModule {}
