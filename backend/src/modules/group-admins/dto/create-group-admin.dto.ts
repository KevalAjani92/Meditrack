import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateGroupAdminDto {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must contain only digits (10)',
  })
  phone_number: string;

  @IsOptional()
  @IsNumber()
  hospital_group_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
