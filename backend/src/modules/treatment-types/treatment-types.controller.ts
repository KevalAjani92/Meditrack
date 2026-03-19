import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TreatmentTypesService } from './treatment-types.service';
import { CreateTreatmentTypeDto } from './dto/create-treatment-type.dto';
import { UpdateTreatmentStatusDto, UpdateTreatmentTypeDto } from './dto/update-treatment-type.dto';
import { GetTreatmentTypeDto } from './dto/get-treatment-type.dto';
import { EnableTreatmentDto } from './dto/enable-treatment.dto';
import { TreatmentTypeQueryDto } from './dto/treatment-type-query-hospital-admin.dto';

@Controller('treatment-types')
export class TreatmentTypesController {
  constructor(private readonly service: TreatmentTypesService) {}

  @Post()
  create(@Body() dto: CreateTreatmentTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('superadmin/all')
  findAllSuperadmin(@Query() query: GetTreatmentTypeDto) {
    return this.service.findAllSuperadmin(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTreatmentTypeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ====================== Hospital-Admin =====================
  @Get('master/:hospital_id')
  getMaster(
    @Param('hospital_id') hospitalId: number,
    @Query() query: TreatmentTypeQueryDto,
  ) {
    return this.service.getMasterTreatments(Number(hospitalId), query);
  }

  @Get('enabled/:hospital_id')
  getEnabled(
    @Param('hospital_id') hospitalId: number,
    @Query() query: TreatmentTypeQueryDto,
  ) {
    return this.service.getEnabledTreatments(Number(hospitalId), query);
  }

  @Get('stats/:hospital_id')
  getStats(@Param('hospital_id') hospitalId: number) {
    return this.service.getTreatmentStats(Number(hospitalId));
  }

  @Post('enable')
  enableTreatment(@Body() dto: EnableTreatmentDto) {
    return this.service.enableTreatment(dto);
  }

  @Patch('status/:hospital_treatment_id')
  updateStatus(
    @Param('hospital_treatment_id') id: number,
    @Body() dto: UpdateTreatmentStatusDto,
  ) {
    return this.service.updateTreatmentStatus(Number(id), dto);
  }
}
