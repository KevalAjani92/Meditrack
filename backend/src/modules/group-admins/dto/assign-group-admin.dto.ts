// dto/assign-group-admin.dto.ts

import { IsOptional, IsNumber } from 'class-validator';

export class AssignGroupAdminDto {
  @IsOptional()
  @IsNumber()
  adminId?: number | null;
}