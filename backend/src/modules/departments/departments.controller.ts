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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { GetDepartmentsDto } from './dto/get-departments.dto';
import { DepartmentQueryDto } from './dto/hospital-admin-department-query.dto';
import { EnableDepartmentDto } from './dto/enable-department.dto';
import { UpdateDepartmentStatusDto } from './dto/update-department-status.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get('superadmin/all')
  findAllSuperadmin(@Query() query: GetDepartmentsDto) {
    return this.departmentsService.findAllSuperadmin(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.remove(id);
  }

  // ===============Hospital-Admin===============

  @Get('hospital-admin/master/:hospital_id')
  getMasterDepartments(
    @Param('hospital_id') hospitalId: number,
    @Query() query: DepartmentQueryDto,
  ) {
    return this.departmentsService.getMasterDepartments(
      Number(hospitalId),
      query,
    );
  }

  @Get('hospital-admin/enabled/:hospital_id')
  getEnabledDepartments(
    @Param('hospital_id') hospitalId: number,
    @Query() query: DepartmentQueryDto,
  ) {
    return this.departmentsService.getEnabledDepartments(
      Number(hospitalId),
      query,
    );
  }

  @Get('hospital-admin/stats/:hospital_id')
  getDepartmentStats(@Param('hospital_id') hospitalId: number) {
    return this.departmentsService.getDepartmentStats(Number(hospitalId));
  }

  /*
  Enable Department
  */

  @Post('hospital-admin/enable-department')
  enableDepartment(@Body() dto: EnableDepartmentDto) {
    return this.departmentsService.enableDepartment(dto);
  }

  /*
  Update Department Status
  */

  @Patch('hospital-admin/status/:hospital_department_id')
  updateDepartmentStatus(
    @Param('hospital_department_id') hospitalDepartmentId: number,
    @Body() dto: UpdateDepartmentStatusDto,
  ) {
    return this.departmentsService.updateDepartmentStatus(
      Number(hospitalDepartmentId),
      dto,
    );
  }
}
