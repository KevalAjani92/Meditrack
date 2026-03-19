// dto/create-department.dto.ts

import { IsString, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  department_code: string;

  @IsString()
  department_name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
