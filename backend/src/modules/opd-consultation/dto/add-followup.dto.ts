import { IsDateString, IsString, MinLength } from 'class-validator';

export class AddFollowupDto {
  @IsDateString()
  recommended_date: string;

  @IsString()
  @MinLength(2)
  reason: string;
}
