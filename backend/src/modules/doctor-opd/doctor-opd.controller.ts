import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { DoctorOpdService } from './doctor-opd.service';
import { QueryQueueDto } from './dto/query-queue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('doctor-opd')
@UseGuards(JwtAuthGuard)
export class DoctorOpdController {
  constructor(private readonly doctorOpdService: DoctorOpdService) {}

  /**
   * GET /doctor-opd/queue
   * Fetch today's queue for the logged-in doctor with search, filter, pagination
   */
  @Get('queue')
  async getQueue(@Req() req: any, @Query() query: QueryQueueDto) {
    return this.doctorOpdService.getQueue(Number(req.user.sub), query);
  }

  /**
   * GET /doctor-opd/stats
   * Queue insight stats (total, waiting, in-progress, completed, avg wait)
   */
  @Get('stats')
  async getStats(@Req() req: any) {
    return this.doctorOpdService.getStats(Number(req.user.sub));
  }

  /**
   * GET /doctor-opd/performance
   * Session performance (patients seen, avg consult time, longest wait)
   */
  @Get('performance')
  async getPerformance(@Req() req: any) {
    return this.doctorOpdService.getPerformance(Number(req.user.sub));
  }

  /**
   * GET /doctor-opd/timeline
   * Timeline events from today's queue
   */
  @Get('timeline')
  async getTimeline(@Req() req: any) {
    return this.doctorOpdService.getTimeline(Number(req.user.sub));
  }

  /**
   * PATCH /doctor-opd/queue/:tokenId/call-next
   * Set token → "In Progress", update appointment → "Waiting" (being consulted)
   */
  @Patch('queue/:tokenId/call-next')
  async callNext(
    @Req() req: any,
    @Param('tokenId', ParseIntPipe) tokenId: number,
  ) {
    return this.doctorOpdService.callNext(Number(req.user.sub), tokenId);
  }

  /**
   * PATCH /doctor-opd/queue/:tokenId/skip
   * Set token → "Skipped"
   */
  @Patch('queue/:tokenId/skip')
  async skipToken(
    @Req() req: any,
    @Param('tokenId', ParseIntPipe) tokenId: number,
  ) {
    return this.doctorOpdService.skipToken(Number(req.user.sub), tokenId);
  }

  /**
   * PATCH /doctor-opd/queue/:tokenId/no-show
   * Set token → "Skipped" (DB constraint), appointment → "No-Show"
   */
  @Patch('queue/:tokenId/no-show')
  async markNoShow(
    @Req() req: any,
    @Param('tokenId', ParseIntPipe) tokenId: number,
  ) {
    return this.doctorOpdService.markNoShow(Number(req.user.sub), tokenId);
  }
}
