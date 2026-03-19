import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDateString,
  IsInt,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  full_name!: string;

  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must contain only digits (10)',
  })
  phone_number!: string;

  // password input
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  // Patient fields
  @IsString()
  @IsNotEmpty()
  @IsIn(['Male', 'Female', 'Other'])
  gender!: string;

  @IsDateString()
  dob!: string;

  @IsInt()
  hospital_group_id!: number;
}
