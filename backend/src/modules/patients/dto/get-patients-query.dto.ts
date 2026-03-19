import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class GetPatientsQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
