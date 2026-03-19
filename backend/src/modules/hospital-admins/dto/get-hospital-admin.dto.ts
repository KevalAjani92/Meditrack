import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetHospitalAdminDto {
  @IsOptional()
  @IsString()
  search?: string;

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
