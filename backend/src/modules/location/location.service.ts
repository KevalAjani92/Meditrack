import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async getStates() {
    const states = await this.prisma.states.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        state_name: 'asc',
      },
      select: {
        state_id: true,
        state_name: true,
        state_code: true,
      },
    });

    return states;
  }

  async getCitiesByState(stateId: number) {
    // 🔎 Validate state exists
    const state = await this.prisma.states.findUnique({
      where: { state_id: stateId },
    });

    if (!state) {
      throw new BadRequestException('Invalid state ID');
    }

    const cities = await this.prisma.cities.findMany({
      where: {
        state_id: stateId,
        is_active: true,
      },
      orderBy: {
        city_name: 'asc',
      },
      select: {
        city_id: true,
        city_name: true,
        city_code: true,
        state_id: true,
      },
    });

    return cities;
  }
}
