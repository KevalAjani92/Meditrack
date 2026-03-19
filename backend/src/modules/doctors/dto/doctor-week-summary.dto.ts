import { IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DoctorWeekSummaryDto {
  @IsDateString()
  weekStart: string; // Monday date
}
