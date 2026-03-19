import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  hospital_code: string;

  @IsString()
  hospital_name: string;

  @IsNumber()
  registration_validity_months: number;

  @IsString()
  receptionist_contact: string;

  @IsDateString()
  opening_date: string;

  @IsString()
  address: string;

  @IsString()
  pincode: string;

  @IsOptional()
  @IsNumber()
  city_id?: number;

  @IsOptional()
  @IsNumber()
  state_id?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  registration_no?: string;

  @IsOptional()
  @IsString()
  license_no?: string;

  @IsOptional()
  @IsString()
  gst_no?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  opening_time?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  closing_time?: string | null;

  @IsBoolean()
  is_24by7: boolean;
}
