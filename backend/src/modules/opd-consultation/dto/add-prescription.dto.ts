import {
  IsInt,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PrescriptionItemDto {
  @IsInt()
  medicine_id: number;

  @IsString()
  @MinLength(1)
  dosage: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(1)
  duration_days: number;

  @IsOptional()
  @IsString()
  instructions?: string;
}

export class AddPrescriptionDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}
