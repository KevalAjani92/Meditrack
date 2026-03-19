import { IsBoolean, IsNumber } from 'class-validator';

export class EnableProcedureDto {
  @IsNumber()
  hospitalId: number;

  @IsNumber()
  procedure_id: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateProcedureDetailDto {

  @IsNumber()
  price: number;

  @IsBoolean()
  isActive: boolean;

}