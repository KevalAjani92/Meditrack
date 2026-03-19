import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReceptionistsAdminService } from './receptionists.service';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
import { GetReceptionistsQueryDto } from './dto/get-receptionists-query.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('hospital-admin/receptionists')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceptionistsAdminController {
  constructor(
    private readonly receptionistsService: ReceptionistsAdminService,
  ) {}

  // List all receptionists for a hospital
  @Get(':hospital_id')
  getAllReceptionists(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Query() query: GetReceptionistsQueryDto,
  ) {
    return this.receptionistsService.getAllReceptionists(hospitalId, query);
  }

  // Create a new receptionist
  @Post(':hospital_id')
  @Roles('HospitalAdmin')
  createReceptionist(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Body() dto: CreateReceptionistDto,
    @GetUser('sub') userId: string,
  ) {
    return this.receptionistsService.createReceptionist(
      hospitalId,
      dto,
      Number(userId),
    );
  }

  // Update receptionist
  @Patch(':user_id')
  updateReceptionist(
    @Param('user_id', ParseIntPipe) userId: number,
    @Body() dto: UpdateReceptionistDto,
  ) {
    return this.receptionistsService.updateReceptionist(userId, dto);
  }

  // Toggle receptionist status
  @Patch(':user_id/status')
  @Roles('HospitalAdmin')
  toggleReceptionistStatus(@Param('user_id', ParseIntPipe) userId: number) {
    return this.receptionistsService.toggleReceptionistStatus(userId);
  }

  // Reset receptionist password
  @Patch(':user_id/reset-password')
  resetReceptionistPassword(@Param('user_id', ParseIntPipe) userId: number) {
    return this.receptionistsService.resetReceptionistPassword(userId);
  }
}
