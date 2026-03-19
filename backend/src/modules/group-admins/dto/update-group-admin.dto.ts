import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupAdminDto } from './create-group-admin.dto';

export class UpdateGroupAdminDto extends PartialType(CreateGroupAdminDto) {}
