import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GetDoctorsQueryDto {
  @IsNumberString()
  @IsNotEmpty()
  hospitalId: string;
}
