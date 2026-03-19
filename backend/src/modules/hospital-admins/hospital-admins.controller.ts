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
import { HospitalAdminsService } from './hospital-admins.service';
import { CreateHospitalAdminDto } from './dto/create-hospital-admin.dto';
import { UpdateHospitalAdminDto } from './dto/update-hospital-admin.dto';
import { GetHospitalAdminDto } from './dto/get-hospital-admin.dto';

@Controller('hospital-admins')
export class HospitalAdminsController {
  constructor(private readonly hospitalAdminsService: HospitalAdminsService) {}

  @Post()
  create(@Body() createHospitalAdminDto: CreateHospitalAdminDto) {
    return this.hospitalAdminsService.create(createHospitalAdminDto);
  }

  @Get()
  findAll() {
    return this.hospitalAdminsService.findAll();
  }

  @Get('groupadmin/all')
  getAllHospitalAdmin(@Query() query: GetHospitalAdminDto) {
    return this.hospitalAdminsService.getAllHospitalAdmin(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.hospitalAdminsService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHospitalAdminDto: UpdateHospitalAdminDto,
  ) {
    return this.hospitalAdminsService.update(+id, updateHospitalAdminDto);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalAdminsService.toggleStatus(id);
  }
}
