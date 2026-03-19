import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  contact_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  contact_number: string;

  @IsOptional()
  @IsString()
  relation?: string;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}
