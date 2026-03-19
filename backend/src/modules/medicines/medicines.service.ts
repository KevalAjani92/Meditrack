import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMedicineDto } from './dto/get-medicine.dto';
import { MedicineQueryDto } from './dto/medicine-query-hospital-admin.dto';
import {
  EnableMedicineDto,
  UpdateMedicineDetailDto,
} from './dto/enable-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicineDto) {
    return this.prisma.medicines.create({
      data: {
        ...dto,
        is_active: dto.is_active ?? true,
      },
    });
  }
  async findAll() {
    return this.prisma.medicines.findMany({
      where: { is_active: true },
      orderBy: { medicine_name: 'asc' },
    });
  }

  async findAllSuperadmin(query: GetMedicineDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    // 🔍 Search
    if (query.search) {
      where.OR = [
        {
          medicine_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          medicine_code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          manufacturer: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 🔎 Filter by type
    if (query.type) {
      where.medicine_type = query.type;
    }

    // 🔎 Filter by status
    if (query.status) {
      where.is_active = query.status === 'Active';
    }

    const [
      medicines,
      filteredCount,
      activeCount,
      inactiveCount,
      distinctManufacturers,
    ] = await this.prisma.$transaction([
      // 🔹 Paginated Data
      this.prisma.medicines.findMany({
        where,
        skip,
        take: limit,
        orderBy: { medicine_name: 'asc' },
      }),

      // 🔹 Total (filtered)
      this.prisma.medicines.count({ where }),

      // 🔹 Active (filtered)
      this.prisma.medicines.count({
        where: {
          ...where,
          is_active: true,
        },
      }),

      // 🔹 Inactive (filtered)
      this.prisma.medicines.count({
        where: {
          ...where,
          is_active: false,
        },
      }),

      // 🔹 Distinct Manufacturers (filtered)
      this.prisma.medicines.findMany({
        where,
        distinct: ['manufacturer'],
        select: { manufacturer: true },
      }),
    ]);

    return {
      data: {
        data: medicines,
        meta: {
          total: filteredCount,
          page,
          limit,
          totalPages: Math.ceil(filteredCount / limit),
        },
        stats: {
          totalMedicines: filteredCount,
          activeMedicines: activeCount,
          inactiveMedicines: inactiveCount,
          distinctManufacturers: distinctManufacturers.filter(
            (m) => m.manufacturer !== null,
          ).length,
        },
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.medicines.findUnique({
      where: { medicine_id: id },
    });
  }

  async update(id: number, dto: UpdateMedicineDto) {
    return this.prisma.medicines.update({
      where: { medicine_id: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.medicines.delete({
      where: { medicine_id: id },
    });
  }

  // =============== Hospital-Admin =======================
  async getMasterMedicines(hospitalId: number, query: MedicineQueryDto) {
    const { search, medicine_type } = query;

    const where: any = {
      is_active: true,

      hospital_medicines: {
        none: {
          hospital_id: hospitalId,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          medicine_name: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          medicine_code: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          manufacturer: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (medicine_type) {
      where.medicine_type = {
        contains: medicine_type,
        mode: 'insensitive',
      };
    }

    const data = await this.prisma.medicines.findMany({
      where,
      orderBy: { medicine_name: 'asc' },
    });

    return {
      success: true,
      data,
    };
  }

  async getEnabledMedicines(hospitalId: number, query: MedicineQueryDto) {
    const { search, medicine_type } = query;

    const where: any = {
      hospital_id: hospitalId,
    };

    if (search) {
      where.medicines = {
        OR: [
          {
            medicine_name: {
              contains: search,
              mode: 'insensitive',
            },
          },

          {
            medicine_code: {
              contains: search,
              mode: 'insensitive',
            },
          },

          {
            manufacturer: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    if (medicine_type) {
      where.medicines = {
        ...where.medicines,
        medicine_type: {
          contains: medicine_type,
          mode: 'insensitive',
        },
      };
    }

    const data = await this.prisma.hospital_medicines.findMany({
      where,

      include: {
        medicines: true,
      },
    });

    const mapped = data.map((m) => ({
      hospital_medicine_id: m.hospital_medicine_id,

      medicine_id: m.medicines.medicine_id,
      medicine_code: m.medicines.medicine_code,
      medicine_name: m.medicines.medicine_name,
      medicine_type: m.medicines.medicine_type,
      strength: m.medicines.strength,
      manufacturer: m.medicines.manufacturer,

      is_active: m.medicines.is_active,
      created_at: m.medicines.created_at,
      modified_at: m.medicines.modified_at,

      price: m.price,
      stock: m.stock_quantity,
      isActive: m.is_active,
    }));

    return {
      success: true,
      data: mapped,
    };
  }

  async enableMedicine(dto: EnableMedicineDto) {
    const exists = await this.prisma.hospital_medicines.findFirst({
      where: {
        hospital_id: dto.hospitalId,
        medicine_id: dto.medicine_id,
      },
    });

    if (exists) {
      throw new BadRequestException('Medicine already enabled');
    }

    const created = await this.prisma.hospital_medicines.create({
      data: {
        hospital_id: dto.hospitalId,
        medicine_id: dto.medicine_id,

        price: dto.price,
        stock_quantity: dto.stock,

        is_active: dto.isActive,
      },
    });

    return {
      success: true,
      message: 'Medicine enabled successfully',
      data: created,
    };
  }

  async updateMedicine(id: number, dto: UpdateMedicineDetailDto) {
    const updated = await this.prisma.hospital_medicines.update({
      where: {
        hospital_medicine_id: id,
      },

      data: {
        price: dto.price,
        stock_quantity: dto.stock,
        is_active: dto.isActive,
      },
    });

    return {
      success: true,
      message: 'Medicine updated successfully',
      data: updated,
    };
  }

  async getMedicineStats(hospitalId: number) {
    const totalMaster = await this.prisma.medicines.count();

    const enabled = await this.prisma.hospital_medicines.findMany({
      where: { hospital_id: hospitalId },
    });

    const totalEnabled = enabled.length;

    const activeCount = enabled.filter((m) => m.is_active).length;

    const lowStockCount = enabled.filter((m) => m.stock_quantity < 10).length;

    return {
      success: true,

      data: {
        totalMaster,
        totalEnabled,
        activeCount,
        lowStockCount,
      },
    };
  }
}
