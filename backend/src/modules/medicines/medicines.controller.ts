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
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { GetMedicineDto } from './dto/get-medicine.dto';
import {
  EnableMedicineDto,
  UpdateMedicineDetailDto,
} from './dto/enable-medicine.dto';
import { MedicineQueryDto } from './dto/medicine-query-hospital-admin.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly service: MedicinesService) {}

  @Post()
  create(@Body() dto: CreateMedicineDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('superadmin/all')
  findAllSuperadmin(@Query() query: GetMedicineDto) {
    return this.service.findAllSuperadmin(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicineDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ============== Hospital-Admin ====================
  @Get('master/:hospital_id')
  getMasterMedicines(
    @Param('hospital_id') hospitalId: number,
    @Query() query: MedicineQueryDto,
  ) {
    return this.service.getMasterMedicines(Number(hospitalId), query);
  }

  @Get('enabled/:hospital_id')
  getEnabledMedicines(
    @Param('hospital_id') hospitalId: number,
    @Query() query: MedicineQueryDto,
  ) {
    return this.service.getEnabledMedicines(Number(hospitalId), query);
  }

  @Get('stats/:hospital_id')
  getMedicineStats(@Param('hospital_id') hospitalId: number) {
    return this.service.getMedicineStats(Number(hospitalId));
  }

  @Post('enable')
  enableMedicine(@Body() dto: EnableMedicineDto) {
    return this.service.enableMedicine(dto);
  }

  @Patch('update/:hospital_medicine_id')
  updateMedicine(
    @Param('hospital_medicine_id') id: number,
    @Body() dto: UpdateMedicineDetailDto,
  ) {
    return this.service.updateMedicine(Number(id), dto);
  }
}
