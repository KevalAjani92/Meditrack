// dto/update-department.dto.ts

import { IsString, IsOptional } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  department_code?: string;

  @IsOptional()
  @IsString()
  department_name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
