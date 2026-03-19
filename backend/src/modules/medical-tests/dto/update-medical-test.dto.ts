// dto/update-medical-test.dto.ts

import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMedicalTestDto {
  @IsOptional()
  @IsString()
  test_code?: string;

  @IsOptional()
  @IsString()
  test_name?: string;

  @IsOptional()
  @IsString()
  test_type?: string;

  @IsOptional()
  @IsNumber()
  department_id?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
