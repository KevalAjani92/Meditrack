import {
  IsInt,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddDiagnosisDto {
  @IsInt()
  diagnosis_id: number;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean = false;

  @IsOptional()
  @IsString()
  remarks?: string;
}
