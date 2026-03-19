// dto/create-medical-test.dto.ts

import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateMedicalTestDto {
  @IsString()
  test_code: string;

  @IsString()
  test_name: string;

  @IsString()
  test_type: string;

  @IsNumber()
  department_id: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
