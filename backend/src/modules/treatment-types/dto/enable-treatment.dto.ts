import { IsBoolean, IsInt } from 'class-validator';

export class EnableTreatmentDto {
  @IsInt()
  hospitalId: number;

  @IsInt()
  treatment_type_id: number;

  @IsBoolean()
  isActive: boolean;
}
