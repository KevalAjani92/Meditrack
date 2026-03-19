// dto/create-medicine.dto.ts

import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  medicine_code: string;

  @IsString()
  medicine_name: string;

  @IsString()
  medicine_type: string;

  @IsString()
  strength: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
