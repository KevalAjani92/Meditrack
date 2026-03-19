import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DoctorAppointmentsQueryDto {
  // @IsInt()
  // doctorId: number;

  @IsString()
  date: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 8;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  time?: string;
}
