import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDiagnosisDto {
  @IsOptional()
  @IsString()
  diagnosis_code?: string;

  @IsOptional()
  @IsString()
  diagnosis_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  department_id?: number;
}
