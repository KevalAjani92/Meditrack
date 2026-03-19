import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GetGroupsDto } from './dto/get-groups.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('stats')
  async getGroupStats() {
    return this.groupsService.getGroupStats();
  }
  @Get('superadmin/all')
  async getGroups(@Query() query: GetGroupsDto) {
    return await this.groupsService.getGroups(query);
  }
  @Get('all')
  async getAllGroups() {
    return await this.groupsService.getAllGroups();
  }

  @Post()
  createGroup(@Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(dto);
  }

  // ✅ Update Group
  @Patch(':id')
  updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupsService.updateGroup(id, dto);
  }
}
