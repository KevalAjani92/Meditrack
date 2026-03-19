import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetDiagnosisDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  department_id?: string; // scoped feature
}
