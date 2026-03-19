import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class DoctorOpdListDto {
  @Type(() => Number)
  @IsInt()
  hospitalId: number;

  // @IsNumber()
  // department_id: number;
}
