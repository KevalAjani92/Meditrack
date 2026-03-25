import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  bill_id: number;

  @IsInt()
  payment_mode_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount_paid: number;

  @IsOptional()
  @IsString()
  reference_number?: string;
}
