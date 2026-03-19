// dto/get-group-admins.dto.ts

import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class GetGroupAdminsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['Active', 'Inactive', 'All'])
  status?: 'Active' | 'Inactive' | 'All';

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
