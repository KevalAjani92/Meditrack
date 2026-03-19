import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDiagnosisDto {
  @IsString()
  diagnosis_code: string;

  @IsString()
  diagnosis_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  department_id: number;
}
