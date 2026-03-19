import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export enum VisitType {
  Scheduled = 'Scheduled',
  WalkIn = 'Walk-In',
  Emergency = 'Emergency',
  FollowUp = 'Follow-Up',
}

export class CreateOpdDto {
  @IsEnum(VisitType)
  visitType: VisitType;

  @IsInt()
  hospital_id: number;

  @IsInt()
  patient_id: number;

  @IsInt()
  doctor_id: number;

  @IsOptional()
  @IsInt()
  appointment_id?: number;

  @IsOptional()
  @IsInt()
  old_opd_id?: number;

  @IsString()
  chief_complaint: string;

  @IsOptional()
  @IsString()
  clinical_notes?: string;

  @IsOptional()
  @IsBoolean()
  skip_queue?: boolean;
}
