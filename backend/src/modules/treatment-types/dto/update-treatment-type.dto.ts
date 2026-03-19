// dto/update-treatment-type.dto.ts

import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTreatmentTypeDto {
  @IsOptional()
  @IsString()
  treatment_code?: string;

  @IsOptional()
  @IsString()
  treatment_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  department_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateTreatmentStatusDto {
  @IsBoolean()
  isActive: boolean;
}
