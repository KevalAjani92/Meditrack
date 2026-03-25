import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class AddProcedureDto {
  @IsInt()
  procedure_id: number;

  @IsDateString()
  procedure_date: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
