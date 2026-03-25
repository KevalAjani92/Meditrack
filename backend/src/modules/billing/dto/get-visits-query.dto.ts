import { IsOptional, IsString } from 'class-validator';

export class GetVisitsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string; // 'Pending Bill' | 'Billed'
}
