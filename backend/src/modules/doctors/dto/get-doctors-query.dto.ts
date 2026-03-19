import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetDoctorsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  department_id?: string;

  @IsOptional()
  @IsString()
  status?: string; // Active | Inactive

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
