import { IsBoolean } from 'class-validator';

export class UpdateDiagnosisStatusDto {
  @IsBoolean()
  isActive: boolean;
}
