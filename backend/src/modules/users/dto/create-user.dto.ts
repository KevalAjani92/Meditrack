import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsInt,
  IsOptional,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateUserDto {
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

  // IMPORTANT: we accept password, not password_hash
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  @IsInt()
  role_id!: number;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  profile_image_url?: string;
}
