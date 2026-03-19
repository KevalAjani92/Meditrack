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
import { MedicalTestsService } from './medical-tests.service';
import { CreateMedicalTestDto } from './dto/create-medical-test.dto';
import { UpdateMedicalTestDto } from './dto/update-medical-test.dto';
import { GetMedicalTestDto } from './dto/get-medical-test.dto';
import { EnableTestDto, UpdateTestStatusDto } from './dto/enable-test.dto';
import { TestQueryDto } from './dto/test-query-hospital-admin.dto';

@Controller('medical-tests')
export class MedicalTestsController {
  constructor(private readonly service: MedicalTestsService) {}

  @Post()
  create(@Body() dto: CreateMedicalTestDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('superadmin/all')
  findAllSuperadmin(@Query() query: GetMedicalTestDto) {
    return this.service.findAllSuperadmin(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicalTestDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ==================== Hospital-Admin=================
  /*
  MASTER TESTS
  */

  @Get('master/:hospital_id')
  getMasterTests(
    @Param('hospital_id') hospitalId: number,
    @Query() query: TestQueryDto,
  ) {
    return this.service.getMasterTests(Number(hospitalId), query);
  }

  /*
  ENABLED TESTS
  */

  @Get('enabled/:hospital_id')
  getEnabledTests(
    @Param('hospital_id') hospitalId: number,
    @Query() query: TestQueryDto,
  ) {
    return this.service.getEnabledTests(Number(hospitalId), query);
  }

  /*
  STATS
  */

  @Get('stats/:hospital_id')
  getTestStats(@Param('hospital_id') hospitalId: number) {
    return this.service.getTestStats(Number(hospitalId));
  }

  /*
  ENABLE TEST
  */

  @Post('enable')
  enableTest(@Body() dto: EnableTestDto) {
    return this.service.enableTest(dto);
  }

  /*
  UPDATE TEST STATUS + PRICE
  */

  @Patch('status/:hospital_test_id')
  updateTestStatus(
    @Param('hospital_test_id') hospitalTestId: number,
    @Body() dto: UpdateTestStatusDto,
  ) {
    return this.service.updateTestStatus(Number(hospitalTestId), dto);
  }
}
