import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class TestQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  department_name?: string;

//   @IsOptional()
//   @Transform(({ value }) => parseInt(value))
//   @IsInt()
//   @Min(1)
//   page: number = 1;

//   @IsOptional()
//   @Transform(({ value }) => parseInt(value))
//   @IsInt()
//   @Min(1)
//   limit: number = 10;
}
