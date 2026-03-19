import { IsOptional, IsString, IsInt, IsEmail, MinLength } from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  phone_number?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  address?: string;

  @IsOptional()
  @IsInt()
  city_id?: number;

  @IsOptional()
  @IsInt()
  state_id?: number;

  @IsOptional()
  @IsString()
  pincode?: string;
}
