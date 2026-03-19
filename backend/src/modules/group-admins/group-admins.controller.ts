import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupAdminsService } from './group-admins.service';
import { CreateGroupAdminDto } from './dto/create-group-admin.dto';
import { GetGroupAdminsDto } from './dto/get-group-admins.dto';
import { UpdateGroupAdminDto } from './dto/update-group-admin.dto';
import { Query } from '@nestjs/common';
import { AssignGroupAdminDto } from './dto/assign-group-admin.dto';

@Controller('group-admins')
export class GroupAdminsController {
  constructor(private readonly groupAdminsService: GroupAdminsService) {}

  @Post()
  create(@Body() createGroupAdminDto: CreateGroupAdminDto) {
    return this.groupAdminsService.create(createGroupAdminDto);
  }

  @Get()
  findAll() {
    return this.groupAdminsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.groupAdminsService.getStats();
  }

  // group-admin.controller.ts

  @Get('superadmin/all')
  async getAllGroupAdmins(@Query() query: GetGroupAdminsDto) {
    return await this.groupAdminsService.getAllGroupAdmins(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupAdminsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupAdminDto: UpdateGroupAdminDto,
  ) {
    return this.groupAdminsService.update(+id, updateGroupAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupAdminsService.remove(+id);
  }

  @Patch(':groupId/assign-admin')
  assignAdmin(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: AssignGroupAdminDto,
  ) {
    return this.groupAdminsService.assignAdmin(groupId, dto.adminId ?? null);
  }
}
