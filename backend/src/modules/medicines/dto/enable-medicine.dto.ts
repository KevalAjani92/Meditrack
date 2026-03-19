import { IsNumber, IsBoolean } from 'class-validator';

export class EnableMedicineDto {
  @IsNumber()
  hospitalId: number;

  @IsNumber()
  medicine_id: number;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateMedicineDetailDto {
  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsBoolean()
  isActive: boolean;
}
