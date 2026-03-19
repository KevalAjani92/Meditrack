import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateEmergencyContactDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  contact_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  contact_number?: string;

  @IsOptional()
  @IsString()
  relation?: string;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}
