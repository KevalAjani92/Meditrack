import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PatientsController],
  imports: [CommonModule],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
