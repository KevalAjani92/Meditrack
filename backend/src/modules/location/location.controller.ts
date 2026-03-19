import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('api')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  // ✅ GET /api/states
  @Get('states')
  getStates() {
    return this.service.getStates();
  }

  // ✅ GET /api/cities?state=1
  @Get('cities')
  getCities(@Query('state', ParseIntPipe) stateId: number) {
    return this.service.getCitiesByState(stateId);
  }
}
