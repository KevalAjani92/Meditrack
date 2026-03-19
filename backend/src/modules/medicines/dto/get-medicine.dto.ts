// dto/get-medicine.dto.ts

import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetMedicineDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string; // Active | Inactive

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
