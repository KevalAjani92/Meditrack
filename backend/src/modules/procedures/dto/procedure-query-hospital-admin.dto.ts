import { IsOptional, IsString } from "class-validator";

export class ProcedureQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
