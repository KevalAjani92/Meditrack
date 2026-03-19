import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEmail,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGroupDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  group_name: string;

  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Z0-9_]{3,30}$/, {
    message:
      'Group code must be uppercase, no spaces, only letters, numbers, underscore',
  })
  group_code: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MaxLength(100)
  registration_no?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^\+?[0-9\s\-]{6,15}$/, {
    message: 'Enter valid contact phone number',
  })
  contact_phone?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  contact_email?: string;
}
