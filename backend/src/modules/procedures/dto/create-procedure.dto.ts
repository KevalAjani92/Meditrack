import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProcedureDto {
  @IsString()
  procedure_code: string;

  @IsString()
  procedure_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  is_surgical: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsNumber()
  treatment_type_id: number;
}
