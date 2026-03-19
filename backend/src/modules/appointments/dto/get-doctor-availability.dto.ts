import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetDoctorAvailabilityDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
