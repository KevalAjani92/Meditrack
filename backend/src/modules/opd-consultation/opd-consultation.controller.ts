import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { OpdConsultationService } from './opd-consultation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { AddDiagnosisDto } from './dto/add-diagnosis.dto';
import { AddProcedureDto } from './dto/add-procedure.dto';
import { AddPrescriptionDto } from './dto/add-prescription.dto';
import { AddTestDto } from './dto/add-test.dto';
import { AddFollowupDto } from './dto/add-followup.dto';

@Controller('opd-consultation')
@UseGuards(JwtAuthGuard)
export class OpdConsultationController {
  constructor(private readonly service: OpdConsultationService) {}

  // ─── Lookup APIs (must be ABOVE /:opdId routes) ─────────────

  /** GET /opd-consultation/lookup/diagnoses?search=... */
  @Get('lookup/diagnoses')
  async lookupDiagnoses(@Req() req: any, @Query('search') search?: string) {
    return this.service.lookupDiagnoses(Number(req.user.sub), search);
  }

  /** GET /opd-consultation/lookup/procedures?search=... */
  @Get('lookup/procedures')
  async lookupProcedures(@Req() req: any, @Query('search') search?: string) {
    return this.service.lookupProcedures(Number(req.user.sub), search);
  }

  /** GET /opd-consultation/lookup/medicines?search=... */
  @Get('lookup/medicines')
  async lookupMedicines(@Req() req: any, @Query('search') search?: string) {
    return this.service.lookupMedicines(Number(req.user.sub), search);
  }

  /** GET /opd-consultation/lookup/tests?search=... */
  @Get('lookup/tests')
  async lookupTests(@Req() req: any, @Query('search') search?: string) {
    return this.service.lookupTests(Number(req.user.sub), search);
  }

  // ─── Visit Details ──────────────────────────────────────────

  /** GET /opd-consultation/:opdId — Full visit details with patient EMR */
  @Get(':opdId')
  async getVisitDetails(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
  ) {
    return this.service.getVisitDetails(Number(req.user.sub), opdId);
  }

  /** GET /opd-consultation/:opdId/past-visits — Patient's previous visits */
  @Get(':opdId/past-visits')
  async getPastVisits(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
  ) {
    return this.service.getPastVisits(opdId);
  }

  /** PATCH /opd-consultation/:opdId — Update chief_complaint, clinical_notes */
  @Patch(':opdId')
  async updateVisit(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
    @Body() dto: UpdateVisitDto,
  ) {
    return this.service.updateVisit(Number(req.user.sub), opdId, dto);
  }

  // ─── Diagnoses ──────────────────────────────────────────────

  /** POST /opd-consultation/:opdId/diagnoses */
  @Post(':opdId/diagnoses')
  async addDiagnosis(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
    @Body() dto: AddDiagnosisDto,
  ) {
    return this.service.addDiagnosis(opdId, dto);
  }

  /** DELETE /opd-consultation/:opdId/diagnoses/:diagId */
  @Delete(':opdId/diagnoses/:diagId')
  async removeDiagnosis(
    @Param('opdId', ParseIntPipe) opdId: number,
    @Param('diagId', ParseIntPipe) diagId: number,
  ) {
    return this.service.removeDiagnosis(opdId, diagId);
  }

  // ─── Procedures ─────────────────────────────────────────────

  /** POST /opd-consultation/:opdId/procedures */
  @Post(':opdId/procedures')
  async addProcedure(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
    @Body() dto: AddProcedureDto,
  ) {
    return this.service.addProcedure(opdId, dto);
  }

  /** DELETE /opd-consultation/:opdId/procedures/:procId */
  @Delete(':opdId/procedures/:procId')
  async removeProcedure(
    @Param('opdId', ParseIntPipe) opdId: number,
    @Param('procId', ParseIntPipe) procId: number,
  ) {
    return this.service.removeProcedure(opdId, procId);
  }

  // ─── Prescriptions ─────────────────────────────────────────

  /** POST /opd-consultation/:opdId/prescriptions */
  @Post(':opdId/prescriptions')
  async savePrescription(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
    @Body() dto: AddPrescriptionDto,
  ) {
    return this.service.savePrescription(Number(req.user.sub), opdId, dto);
  }

  // ─── Tests ──────────────────────────────────────────────────

  /** POST /opd-consultation/:opdId/tests */
  @Post(':opdId/tests')
  async orderTest(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
    @Body() dto: AddTestDto,
  ) {
    return this.service.orderTest(opdId, dto);
  }

  /** DELETE /opd-consultation/:opdId/tests/:testId */
  @Delete(':opdId/tests/:testId')
  async removeTest(
    @Param('opdId', ParseIntPipe) opdId: number,
    @Param('testId', ParseIntPipe) testId: number,
  ) {
    return this.service.removeTest(opdId, testId);
  }

  // ─── Follow-ups ─────────────────────────────────────────────

  /** POST /opd-consultation/:opdId/followups */
  @Post(':opdId/followups')
  async scheduleFollowup(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
    @Body() dto: AddFollowupDto,
  ) {
    return this.service.scheduleFollowup(opdId, dto);
  }

  /** DELETE /opd-consultation/:opdId/followups/:followupId */
  @Delete(':opdId/followups/:followupId')
  async removeFollowup(
    @Param('opdId', ParseIntPipe) opdId: number,
    @Param('followupId', ParseIntPipe) followupId: number,
  ) {
    return this.service.removeFollowup(opdId, followupId);
  }

  // ─── Complete Consultation ──────────────────────────────────

  /** PATCH /opd-consultation/:opdId/complete */
  @Patch(':opdId/complete')
  async completeConsultation(
    @Req() req: any,
    @Param('opdId', ParseIntPipe) opdId: number,
  ) {
    return this.service.completeConsultation(Number(req.user.sub), opdId);
  }
}
