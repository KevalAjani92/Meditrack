import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { GetDiagnosisDto } from './dto/get-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { UpdateDiagnosisStatusDto } from './dto/update-diagnosis-status.dto';
import { EnableDiagnosisDto } from './dto/enable-diagnosis.dto';
import { DiagnosisQueryDto } from './dto/hospital-admin-diagnosis-query.dto';

@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly service: DiagnosisService) {}

  @Post()
  create(@Body() dto: CreateDiagnosisDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('superadmin/all')
  findAllSuperadmin(@Query() query: GetDiagnosisDto) {
    return this.service.findAllSuperadmin(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiagnosisDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ==================== Hospital-Admin =====================
  @Get('master/:hospital_id')
  getMasterDiagnoses(
    @Param('hospital_id') hospitalId: number,
    @Query() query: DiagnosisQueryDto,
  ) {
    return this.service.getMasterDiagnoses(Number(hospitalId), query);
  }

  @Get('enabled/:hospital_id')
  getEnabledDiagnoses(
    @Param('hospital_id') hospitalId: number,
    @Query() query: DiagnosisQueryDto,
  ) {
    return this.service.getEnabledDiagnoses(Number(hospitalId), query);
  }

  @Get('stats/:hospital_id')
  getDiagnosisStats(@Param('hospital_id') hospitalId: number) {
    return this.service.getDiagnosisStats(Number(hospitalId));
  }

  @Post('enable')
  enableDiagnosis(@Body() dto: EnableDiagnosisDto) {
    return this.service.enableDiagnosis(dto);
  }

  @Patch('status/:hospital_diagnosis_id')
  updateDiagnosisStatus(
    @Param('hospital_diagnosis_id') id: number,
    @Body() dto: UpdateDiagnosisStatusDto,
  ) {
    return this.service.updateDiagnosisStatus(Number(id), dto);
  }
}
