import { Module } from '@nestjs/common';
import { TreatmentTypesService } from './treatment-types.service';
import { TreatmentTypesController } from './treatment-types.controller';

@Module({
  controllers: [TreatmentTypesController],
  providers: [TreatmentTypesService],
})
export class TreatmentTypesModule {}
