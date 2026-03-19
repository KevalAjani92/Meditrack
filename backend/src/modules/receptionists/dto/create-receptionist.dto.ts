import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateReceptionistDto {
  @IsString()
  @MinLength(2)
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone_number: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
