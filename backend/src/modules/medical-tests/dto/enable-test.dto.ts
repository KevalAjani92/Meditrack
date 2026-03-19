import { IsInt, IsBoolean, IsNumber } from 'class-validator';

export class EnableTestDto {
  @IsInt()
  hospitalId: number;

  @IsInt()
  test_id: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateTestStatusDto {
  @IsNumber()
  price: number;

  @IsBoolean()
  isActive: boolean;
}
