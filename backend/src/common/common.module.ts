import { Module } from '@nestjs/common';
import { CounterService } from './services/counter/counter.service';

@Module({
  providers: [CounterService],
  exports: [CounterService],
})
export class CommonModule {}
