import { IsOptional, IsString } from 'class-validator';

export class MedicineQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  medicine_type?: string;
}
