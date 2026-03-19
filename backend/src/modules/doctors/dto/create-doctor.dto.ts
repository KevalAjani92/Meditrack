import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @MinLength(2)
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone_number: string;

  @IsInt()
  department_id: number;

  @IsInt()
  specialization_id: number;

  @IsEnum(['Male', 'Female', 'Other'])
  gender: string;

  @IsString()
  @MinLength(2)
  qualification: string;

  @IsInt()
  @Min(0)
  experience_years: number;

  @IsNumber()
  @Min(0)
  consultation_fees: number;

  @IsString()
  @MinLength(3)
  medical_license_no: string;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
