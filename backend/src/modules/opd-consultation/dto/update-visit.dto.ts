import { IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class UpdateVisitDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  chief_complaint?: string;

  @IsOptional()
  @IsString()
  clinical_notes?: string;
}
