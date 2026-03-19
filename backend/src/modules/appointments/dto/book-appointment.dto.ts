import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class BookAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  hospital_id: number;

  @IsInt()
  @IsNotEmpty()
  doctor_id: number;

  @IsDateString()
  @IsNotEmpty()
  appointment_date: string;

  @IsString()
  @IsNotEmpty()
  appointment_time: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  remarks?: string;
}
