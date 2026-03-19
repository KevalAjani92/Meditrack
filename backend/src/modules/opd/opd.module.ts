import { Module } from '@nestjs/common';
import { OpdService } from './opd.service';
import { OpdController } from './opd.controller';
import { QueueService } from './queue.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [OpdController],
  providers: [OpdService, QueueService],
})
export class OpdModule {}
