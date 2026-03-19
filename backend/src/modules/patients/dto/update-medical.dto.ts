import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateMedicalDto {
  @IsOptional()
  @IsInt()
  blood_group_id?: number;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  chronic_conditions?: string;

  @IsOptional()
  @IsString()
  current_medications?: string;
}
