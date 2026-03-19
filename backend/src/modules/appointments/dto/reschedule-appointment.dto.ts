import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  appointment_date: string;

  @IsString()
  @IsNotEmpty()
  appointment_time: string;
}
