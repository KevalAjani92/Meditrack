import { IsBoolean, IsInt } from 'class-validator';

export class EnableDepartmentDto {
  @IsInt()
  hospitalId: number;

  @IsInt()
  department_id: number;

  @IsBoolean()
  isActive: boolean;
}
