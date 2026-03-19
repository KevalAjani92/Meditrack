import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateMedicalDto } from './dto/update-medical.dto';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { GetPatientsQueryDto } from './dto/get-patients-query.dto';
import { PatientSearchDto } from './dto/patient-search.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  /**
   * GET /patients/me
   * Full profile for the logged-in patient.
   */
  @Get('me')
  @Roles('Patient')
  getMyProfile(@GetUser('sub') userId: string) {
    return this.patientsService.getMyProfile(Number(userId));
  }

  /**
   * POST /patients/reception/register
   * Register Walk-in Patient by Receptionist.
   */

  @Post('reception/register')
  @Roles('Receptionist')
  registerPatient(
    @Body() dto: RegisterPatientDto,
    @GetUser('sub') userId: string,
  ) {
    return this.patientsService.registerPatient(dto, Number(userId));
  }

  /**
   * PATCH /patients/me/personal
   * Update personal info (name, gender, dob).
   */
  @Patch('me/personal')
  @Roles('Patient')
  updatePersonal(
    @GetUser('sub') userId: string,
    @Body() dto: UpdatePersonalDto,
  ) {
    return this.patientsService.updatePersonal(Number(userId), dto);
  }

  /**
   * PATCH /patients/me/contact
   * Update contact details (email, phone, address, etc.).
   */
  @Patch('me/contact')
  @Roles('Patient')
  updateContact(@GetUser('sub') userId: string, @Body() dto: UpdateContactDto) {
    return this.patientsService.updateContact(Number(userId), dto);
  }

  /**
   * PATCH /patients/me/medical
   * Update medical details (blood group, allergies, etc.).
   */
  @Patch('me/medical')
  @Roles('Patient')
  updateMedical(@GetUser('sub') userId: string, @Body() dto: UpdateMedicalDto) {
    return this.patientsService.updateMedical(Number(userId), dto);
  }

  /**
   * GET /patients/me/emergency-contacts
   * List emergency contacts.
   */
  @Get('me/emergency-contacts')
  @Roles('Patient')
  getEmergencyContacts(@GetUser('sub') userId: string) {
    return this.patientsService.getEmergencyContacts(Number(userId));
  }

  /**
   * POST /patients/me/emergency-contacts
   * Add a new emergency contact.
   */
  @Post('me/emergency-contacts')
  @Roles('Patient')
  createEmergencyContact(
    @GetUser('sub') userId: string,
    @Body() dto: CreateEmergencyContactDto,
  ) {
    return this.patientsService.createEmergencyContact(Number(userId), dto);
  }

  /**
   * PATCH /patients/me/emergency-contacts/:id
   * Update an emergency contact.
   */
  @Patch('me/emergency-contacts/:id')
  @Roles('Patient')
  updateEmergencyContact(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmergencyContactDto,
  ) {
    return this.patientsService.updateEmergencyContact(Number(userId), id, dto);
  }

  /**
   * DELETE /patients/me/emergency-contacts/:id
   * Delete an emergency contact.
   */
  @Delete('me/emergency-contacts/:id')
  @Roles('Patient')
  deleteEmergencyContact(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.patientsService.deleteEmergencyContact(Number(userId), id);
  }

  @Get()
  getAllPatients(@Query() query: GetPatientsQueryDto) {
    return this.patientsService.getAllPatients(query);
  }

  @Get(':patientId/summary')
  async getPatientSummary(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.patientsService.getPatientSummary(patientId);
  }

  @Get('search')
  async searchPatients(@Query() query: PatientSearchDto) {
    return this.patientsService.searchPatients(query);
  }

  @Get(':patientId/opd-history')
  async getOpdHistory(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.patientsService.getOpdHistory(patientId);
  }
}
