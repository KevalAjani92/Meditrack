import { IsBoolean, IsInt } from 'class-validator';

export class EnableDiagnosisDto {
  @IsInt()
  hospitalId: number;

  @IsInt()
  diagnosis_id: number;

  @IsBoolean()
  isActive: boolean;
}
