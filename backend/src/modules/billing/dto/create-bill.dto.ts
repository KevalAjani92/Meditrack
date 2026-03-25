import {
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBillItemDto {
  @IsString()
  @IsIn(['Consultation', 'Test', 'Procedure', 'Medicine', 'Other'])
  item_type: string;

  @IsOptional()
  @IsInt()
  reference_id?: number;

  @IsString()
  @MinLength(2)
  @MaxLength(250)
  item_description: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unit_price: number;
}

export class CreateBillDto {
  @IsInt()
  visit_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBillItemDto)
  bill_items: CreateBillItemDto[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  tax_amount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discount_amount: number;

  // Optional initial payment
  @IsOptional()
  @IsInt()
  payment_mode_id?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  payment_amount?: number;

  @IsOptional()
  @IsString()
  payment_reference?: string;
}
