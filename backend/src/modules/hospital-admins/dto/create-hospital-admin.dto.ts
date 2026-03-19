import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHospitalAdminDto {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsOptional()
  @IsNumber()
  hospital_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
