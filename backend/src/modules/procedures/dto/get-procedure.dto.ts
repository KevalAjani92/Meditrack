import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetProcedureDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string; // Surgical | Non-Surgical | All

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
