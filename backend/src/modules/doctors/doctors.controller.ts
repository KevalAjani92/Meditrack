import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DoctorsAdminService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('hospital-admin/doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsAdminController {
  constructor(private readonly doctorsService: DoctorsAdminService) {}

  // Dropdown: Specializations
  @Get('specializations')
  getSpecializations() {
    return this.doctorsService.getSpecializations();
  }

  // Dropdown: Departments for a hospital
  @Get('departments/:hospital_id')
  getDepartmentDropdown(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
  ) {
    return this.doctorsService.getDepartmentDropdown(hospitalId);
  }

  // List all doctors for a hospital
  @Get(':hospital_id')
  getAllDoctors(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Query() query: GetDoctorsQueryDto,
  ) {
    return this.doctorsService.getAllDoctors(hospitalId, query);
  }

  // Create a new doctor
  @Post(':hospital_id')
  @Roles('HospitalAdmin')
  createDoctor(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Body() dto: CreateDoctorDto,
    @GetUser('sub') userId: string,
  ) {
    return this.doctorsService.createDoctor(hospitalId, dto, Number(userId));
  }

  // Update doctor
  @Patch(':doctor_id')
  updateDoctor(
    @Param('doctor_id', ParseIntPipe) doctorId: number,
    @Body() dto: UpdateDoctorDto,
    @GetUser('sub') userId: string,
  ) {
    return this.doctorsService.updateDoctor(doctorId, dto, Number(userId));
  }

  // Toggle doctor status
  @Patch(':doctor_id/status')
  @Roles('HospitalAdmin')
  toggleDoctorStatus(@Param('doctor_id', ParseIntPipe) doctorId: number) {
    return this.doctorsService.toggleDoctorStatus(doctorId);
  }

  // Reset doctor password
  @Patch(':doctor_id/reset-password')
  @Roles('HospitalAdmin')
  resetDoctorPassword(@Param('doctor_id', ParseIntPipe) doctorId: number) {
    return this.doctorsService.resetDoctorPassword(doctorId);
  }

}
