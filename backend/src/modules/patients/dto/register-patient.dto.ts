import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  relation: string;

  @IsOptional()
  isPrimary?: boolean;
}

export class RegisterPatientDto {
  @IsString()
  fullName: string;

  @IsString()
  gender: string;

  @IsString()
  dob: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  address: string;

  @IsNumber()
  state_id: number;

  @IsNumber()
  city_id: number;

  @IsString()
  pincode: string;

  @IsString()
  bloodGroup: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  chronicConditions?: string;

  @IsOptional()
  @IsString()
  currentMedications?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  emergencyContacts: EmergencyContactDto[];
}
