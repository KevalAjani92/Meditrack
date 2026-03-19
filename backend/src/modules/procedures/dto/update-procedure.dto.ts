import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProcedureDto {
  @IsOptional()
  @IsString()
  procedure_code?: string;

  @IsOptional()
  @IsString()
  procedure_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_surgical?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
