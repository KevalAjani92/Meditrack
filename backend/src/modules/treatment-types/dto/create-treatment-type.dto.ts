// dto/create-treatment-type.dto.ts

import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateTreatmentTypeDto {
  @IsString()
  treatment_code: string;

  @IsString()
  treatment_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  department_id: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
