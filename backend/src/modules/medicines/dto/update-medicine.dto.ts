// dto/update-medicine.dto.ts

import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMedicineDto {
  @IsOptional()
  @IsString()
  medicine_code?: string;

  @IsOptional()
  @IsString()
  medicine_name?: string;

  @IsOptional()
  @IsString()
  medicine_type?: string;

  @IsOptional()
  @IsString()
  strength?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
