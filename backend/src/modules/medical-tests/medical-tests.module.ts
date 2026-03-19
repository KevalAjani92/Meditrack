import { Module } from '@nestjs/common';
import { MedicalTestsService } from './medical-tests.service';
import { MedicalTestsController } from './medical-tests.controller';

@Module({
  controllers: [MedicalTestsController],
  providers: [MedicalTestsService],
})
export class MedicalTestsModule {}
