// dto/get-medical-test.dto.ts

import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetMedicalTestDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  department_id?: string;

  @IsOptional()
  @IsString()
  status?: string; // Active | Inactive
}
