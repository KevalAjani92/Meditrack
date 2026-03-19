import { IsOptional, IsString, IsEnum, IsDateString, MinLength } from 'class-validator';

export class UpdatePersonalDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  full_name?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other'])
  gender?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;
}
