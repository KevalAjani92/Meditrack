import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { GetProcedureDto } from './dto/get-procedure.dto';
import {
  EnableProcedureDto,
  UpdateProcedureDetailDto,
} from './dto/enable-procedure.dto';
import { ProcedureQueryDto } from './dto/procedure-query-hospital-admin.dto';

@Controller('procedures')
export class ProceduresController {
  constructor(private readonly service: ProceduresService) {}

  @Post(':treatmentId')
  create(
    @Param('treatmentId', ParseIntPipe) treatmentId: number,
    @Body() dto: CreateProcedureDto,
  ) {
    return this.service.create(treatmentId, dto);
  }

  @Get('superadmin/all/:treatmentId')
  findAllSuperAdmin(
    @Param('treatmentId', ParseIntPipe) treatmentId: number,
    @Query() query: GetProcedureDto,
  ) {
    return this.service.findAllSuperadmin(treatmentId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProcedureDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ===================== Hospital-Admin =======================
  /*
  MASTER PROCEDURES
  */

  @Get('master/:hospital_id/:treatment_type_id')
  getMasterProcedures(
    @Param('hospital_id') hospitalId: number,
    @Param('treatment_type_id') treatmentTypeId: number,
    @Query() query: ProcedureQueryDto,
  ) {
    return this.service.getMasterProcedures(
      Number(hospitalId),
      Number(treatmentTypeId),
      query,
    );
  }

  /*
  ENABLED PROCEDURES
  */

  @Get('enabled/:hospital_id/:treatment_type_id')
  getEnabledProcedures(
    @Param('hospital_id') hospitalId: number,
    @Param('treatment_type_id') treatmentTypeId: number,
    @Query() query: ProcedureQueryDto,
  ) {
    return this.service.getEnabledProcedures(
      Number(hospitalId),
      Number(treatmentTypeId),
      query,
    );
  }

  /*
  PROCEDURE STATS
  */

  @Get('stats/:hospital_id/:treatment_type_id')
  getProcedureStats(
    @Param('hospital_id') hospitalId: number,
    @Param('treatment_type_id') treatmentTypeId: number,
  ) {
    return this.service.getProcedureStats(
      Number(hospitalId),
      Number(treatmentTypeId),
    );
  }

  /*
  ENABLE PROCEDURE
  */

  @Post('enable')
  enableProcedure(@Body() dto: EnableProcedureDto) {
    return this.service.enableProcedure(dto);
  }

  /*
  UPDATE PROCEDURE STATUS + PRICE
  */

  @Patch('update/:hospital_procedure_id')
  updateProcedure(
    @Param('hospital_procedure_id') id: number,
    @Body() dto: UpdateProcedureDetailDto,
  ) {
    return this.service.updateProcedure(Number(id), dto);
  }

  /*
  TREATMENT DETAIL
  */

  @Get('treatment-detail/:treatment_type_id')
  getTreatmentDetail(@Param('treatment_type_id') treatmentTypeId: number) {
    return this.service.getTreatmentDetail(Number(treatmentTypeId));
  }
}
