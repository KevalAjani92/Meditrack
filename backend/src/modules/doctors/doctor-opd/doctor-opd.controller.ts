import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DoctorOpdService } from './doctor-opd.service';
import { DoctorOpdListDto } from '../dto/doctor-opd-list.dto';
import { DoctorAppointmentsQueryDto } from '../dto/doctor-appointments-query.dto';
import { DoctorWeekSummaryDto } from '../dto/doctor-week-summary.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OpdQueueQueryDto } from '../dto/opd-queue-query.dto';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorOpdController {
  constructor(private readonly doctorsService: DoctorOpdService) {}

  @Get('opd-list')
  async getDoctors(@Query() query: DoctorOpdListDto) {
    return this.doctorsService.getOpdDoctors(query);
  }

  @Get('appointments')
  async getDoctorAppointments(
    @Query() query: DoctorAppointmentsQueryDto,
    @GetUser('sub') userId: string,
  ) {
    return this.doctorsService.getDoctorAppointments(query, Number(userId));
  }

  @Get('appointments/week-summary')
  async getDoctorWeekSummary(
    @Query() query: DoctorWeekSummaryDto,
    @GetUser('sub') userId: string,
  ) {
    return this.doctorsService.getDoctorWeekSummary(query, Number(userId));
  }

  @Get('queue/doctor-status/:doctorId')
  async getDoctorQueueStatus(
    @Param('doctorId', ParseIntPipe) doctorId: number,
  ) {
    return this.doctorsService.getDoctorQueueStatus(doctorId);
  }

  @Get('opd-queue')
  async getQueue(
    @Query() query: OpdQueueQueryDto,
    @GetUser('sub') userId: string,
  ) {
    return this.doctorsService.getDoctorQueue(Number(userId), query);
  }

  @Get('opd-performance')
  async getPerformance(@GetUser('sub') userId: string) {
    return this.doctorsService.getDoctorPerformance(Number(userId));
  }
  // @Get('opd-queue/timeline')
  // async getTimeline(@Req() req) {
  //   const userId = req.user.user_id;

  //   return this.service.getQueueTimeline(userId);
  // }
}
