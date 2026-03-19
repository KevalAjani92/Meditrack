// dto/get-departments.dto.ts

import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetDepartmentsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
