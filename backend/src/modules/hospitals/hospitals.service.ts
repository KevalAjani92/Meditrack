import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetHospitalDto } from './dto/get-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(private prisma: PrismaService) {}

  private GROUP_ID = 1;
  private USER_ID = 2;

  async create(dto: CreateHospitalDto) {
    return this.prisma.hospitals.create({
      data: {
        ...dto,
        opening_date: new Date(dto.opening_date),
        hospital_group_id: this.GROUP_ID,
        is_active: true,
        created_by: this.USER_ID,
        modified_by: this.USER_ID,
      },
    });
  }

  async update(id: number, dto: UpdateHospitalDto) {
    return this.prisma.hospitals.update({
      where: { hospital_id: id },
      data: {
        ...dto,
        opening_date: dto.opening_date ? new Date(dto.opening_date) : undefined,

        modified_by: 1,
      },
    });
  }

  async toggleStatus(id: number) {
    const hospital = await this.prisma.hospitals.findUnique({
      where: { hospital_id: id },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    return this.prisma.hospitals.update({
      where: { hospital_id: id },
      data: { is_active: !hospital.is_active },
    });
  }

  async findAll() {
    const where = {
      hospital_group_id: this.GROUP_ID,
    };

    const hospitals = await this.prisma.hospitals.findMany({
      where,
      orderBy: { hospital_name: 'asc' },
      include: {
        cities: true,
        states: true,
        employees: {
          where: { employee_type: 'HospitalAdmin' },
          orderBy: { employee_id: 'asc' }, // ensures predictable admin
          take: 1,
          include: { users_employees_user_idTousers: true },
        },
      },
    });

    return {
      data: hospitals.map((h) => {
        const adminEmployee = h.employees?.[0];

        return {
          hospital_id: h.hospital_id,
          hospital_group_id: h.hospital_group_id,
          hospital_code: h.hospital_code,
          hospital_name: h.hospital_name,
          registration_validity_months: h.registration_validity_months,
          receptionist_contact: h.receptionist_contact,
          opening_date: h.opening_date,
          address: h.address,
          pincode: h.pincode,

          city_id: h.city_id,
          city_name: h.cities?.city_name ?? null,

          state_id: h.state_id,
          state_name: h.states?.state_name ?? null,

          description: h.description,
          registration_no: h.registration_no,
          license_no: h.license_no,
          gst_no: h.gst_no,

          contact_phone: h.contact_phone,
          contact_email: h.contact_email,

          opening_time: h.opening_time,
          closing_time: h.closing_time,
          is_24by7: h.is_24by7,
          is_active: h.is_active,

          admin_id:
            adminEmployee?.users_employees_user_idTousers?.user_id ?? null,

          admin_name:
            adminEmployee?.users_employees_user_idTousers?.full_name ?? null,

          created_by: h.created_by,
          modified_by: h.modified_by,
          created_at: h.created_at,
          modified_at: h.modified_at,
        };
      }),
    };
  }

  async getAllHospitals(query: GetHospitalDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {
      hospital_group_id: this.GROUP_ID,
    };

    // 🔍 Search
    if (query.search) {
      where.OR = [
        {
          hospital_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          hospital_code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          cities: {
            city_name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // 🔎 Status Filter
    if (query.status) {
      where.is_active = query.status === 'Active';
    }

    const [
      hospitals,
      filteredCount,
      activeCount,
      inactiveCount,
      twentyFourSevenCount,
    ] = await this.prisma.$transaction([
      this.prisma.hospitals.findMany({
        where,
        skip,
        take: limit,
        orderBy: { hospital_name: 'asc' },
        include: {
          cities: true,
          states: true,
          employees: {
            where: { employee_type: 'HospitalAdmin' },
            take: 1,
            include: { users_employees_user_idTousers: true },
          },
        },
      }),

      this.prisma.hospitals.count({ where }),

      this.prisma.hospitals.count({
        where: { ...where, is_active: true },
      }),

      this.prisma.hospitals.count({
        where: { ...where, is_active: false },
      }),

      this.prisma.hospitals.count({
        where: { ...where, is_24by7: true },
      }),
    ]);

    return {
      data: {
        data: hospitals.map((h) => ({
          hospital_id: h.hospital_id,
          hospital_group_id: h.hospital_group_id,
          hospital_code: h.hospital_code,
          hospital_name: h.hospital_name,
          registration_validity_months: h.registration_validity_months,
          receptionist_contact: h.receptionist_contact,
          opening_date: h.opening_date,
          address: h.address,
          pincode: h.pincode,
          city_id: h.city_id,
          city_name: h.cities?.city_name ?? null,
          state_id: h.state_id,
          state_name: h.states?.state_name ?? null,
          description: h.description,
          registration_no: h.registration_no,
          license_no: h.license_no,
          gst_no: h.gst_no,
          contact_phone: h.contact_phone,
          contact_email: h.contact_email,
          opening_time: h.opening_time,
          closing_time: h.closing_time,
          is_24by7: h.is_24by7,
          is_active: h.is_active,
          admin_id:
            h.employees[0]?.users_employees_user_idTousers?.user_id ?? null,
          admin_name:
            h.employees[0]?.users_employees_user_idTousers?.full_name ?? null,
          created_by: h.created_by,
          modified_by: h.modified_by,
          created_at: h.created_at,
          modified_at: h.modified_at,
        })),

        meta: {
          total: filteredCount,
          page,
          limit,
          totalPages: Math.ceil(filteredCount / limit),
        },

        stats: {
          totalHospitals: filteredCount,
          activeHospitals: activeCount,
          inactiveHospitals: inactiveCount,
          twentyFourSevenHospitals: twentyFourSevenCount,
        },
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} hospital`;
  }

  remove(id: number) {
    return `This action removes a #${id} hospital`;
  }
}
