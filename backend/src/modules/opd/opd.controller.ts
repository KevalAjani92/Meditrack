import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OpdService } from './opd.service';
import { CreateOpdDto } from './dto/create-opd.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('opd-visits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OpdController {
  constructor(private readonly opdService: OpdService) {}

  @Post()
  @Roles('Receptionist')
  async createOpd(@Body() dto: CreateOpdDto, @GetUser('sub') userId: string) {
    const result = await this.opdService.createOpd(dto, Number(userId));

    return {
      success: true,
      data: result,
    };
  }
}
