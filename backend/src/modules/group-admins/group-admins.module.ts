import { Module } from '@nestjs/common';
import { GroupAdminsService } from './group-admins.service';
import { GroupAdminsController } from './group-admins.controller';

@Module({
  controllers: [GroupAdminsController],
  providers: [GroupAdminsService],
})
export class GroupAdminsModule {}
