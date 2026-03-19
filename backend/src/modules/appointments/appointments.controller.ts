import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { GetDoctorAvailabilityDto } from './dto/get-doctor-availability.dto';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Request } from 'express';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * GET /appointments/hospitals
   * Step 1 — List active hospitals for the patient's group.
   */
  @Get('hospitals')
  @Roles('Patient')
  getHospitals(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.appointmentsService.getHospitalsForBooking(
      user.hospitalgroupid ?? undefined,
    );
  }

  /**
   * GET /appointments/hospitals/:hospitalId/departments
   * Step 2 — List departments available at a hospital.
   */
  @Get('hospitals/:hospitalId/departments')
  @Roles('Patient')
  getDepartmentsByHospital(
    @Param('hospitalId', ParseIntPipe) hospitalId: number,
  ) {
    return this.appointmentsService.getDepartmentsByHospital(hospitalId);
  }

  /**
   * GET /appointments/departments/:departmentId/doctors?hospitalId=
   * Step 3 — List doctors in a department for a specific hospital.
   */
  @Get('departments/:departmentId/doctors')
  @Roles('Patient')
  getDoctorsByDepartment(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Query() query: GetDoctorsQueryDto,
  ) {
    return this.appointmentsService.getDoctorsByDepartment(
      departmentId,
      parseInt(query.hospitalId),
    );
  }

  /**
   * GET /appointments/doctors/:doctorId/availability?date=YYYY-MM-DD
   * Step 4 — Get available time slots for a doctor on a specific date.
   */
  @Get('doctors/:doctorId/availability')
  @Roles('Patient')
  getDoctorAvailability(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @Query() query: GetDoctorAvailabilityDto,
  ) {
    return this.appointmentsService.getDoctorAvailability(doctorId, query.date);
  }

  /**
   * POST /appointments/book
   * Step 6 — Confirm and book the appointment.
   */
  @Post('book')
  @Roles('Patient')
  bookAppointment(
    @Body() dto: BookAppointmentDto,
    @GetUser('sub') userId: string,
  ) {
    return this.appointmentsService.bookAppointment(dto, Number(userId));
  }

  /**
   * GET /appointments/my
   * List all appointments for the logged-in patient.
   */
  @Get('my')
  @Roles('Patient')
  getMyAppointments(@GetUser('sub') userId: string) {
    return this.appointmentsService.getMyAppointments(Number(userId));
  }

  /**
   * PATCH /appointments/:id/cancel
   * Cancel an appointment (must be >24h before).
   */
  @Patch(':id/cancel')
  @Roles('Patient')
  cancelAppointment(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('sub') userId: string,
  ) {
    return this.appointmentsService.cancelAppointment(id, Number(userId));
  }

  /**
   * PATCH /appointments/:id/reschedule
   * Reschedule an appointment with a new date and time.
   */
  @Patch(':id/reschedule')
  @Roles('Patient')
  rescheduleAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RescheduleAppointmentDto,
    @GetUser('sub') userId: string,
  ) {
    return this.appointmentsService.rescheduleAppointment(
      id,
      dto,
      Number(userId),
    );
  }

  @Get('today')
  getTodayAppointments(@Query() quey: any) {
    return this.appointmentsService.getTodayAppointments(
      Number(quey.hospitalId),
    );
  }

  @Get(':appointmentId')
  getAppointmentDetails(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    return this.appointmentsService.getAppointmentDetails(appointmentId);
  }
}
