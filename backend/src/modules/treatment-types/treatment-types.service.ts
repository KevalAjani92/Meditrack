import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTreatmentTypeDto } from './dto/create-treatment-type.dto';
import {
  UpdateTreatmentStatusDto,
  UpdateTreatmentTypeDto,
} from './dto/update-treatment-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTreatmentTypeDto } from './dto/get-treatment-type.dto';
import { TreatmentTypeQueryDto } from './dto/treatment-type-query-hospital-admin.dto';
import { EnableTreatmentDto } from './dto/enable-treatment.dto';

@Injectable()
export class TreatmentTypesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTreatmentTypeDto) {
    return this.prisma.treatment_types.create({
      data: {
        ...dto,
        is_active: dto.is_active ?? true,
      },
    });
  }
  async findAll() {
    return this.prisma.treatment_types.findMany({
      orderBy: { treatment_name: 'asc' },
      include: {
        departments_master: {
          select: { department_name: true },
        },
      },
    });
  }

  async findAllSuperadmin(query: GetTreatmentTypeDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '6');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Scoped filter
    if (query.department_id) {
      where.department_id = Number(query.department_id);
    }

    // Status filter
    if (query.status) {
      where.is_active = query.status === 'Active';
    }

    // Search
    if (query.search) {
      where.OR = [
        {
          treatment_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          treatment_code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          departments_master: {
            department_name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [
      treatments,
      filteredCount,
      totalTreatments,
      activeCount,
      inactiveCount,
      departmentsWithTreatments,
    ] = await this.prisma.$transaction([
      this.prisma.treatment_types.findMany({
        where,
        skip,
        take: limit,
        orderBy: { treatment_name: 'asc' },
        include: {
          departments_master: {
            select: { department_name: true },
          },
        },
      }),

      this.prisma.treatment_types.count({ where }),

      // Stats (scoped-aware)
      this.prisma.treatment_types.count({
        where: query.department_id
          ? { department_id: Number(query.department_id) }
          : {},
      }),

      this.prisma.treatment_types.count({
        where: {
          ...(query.department_id
            ? { department_id: Number(query.department_id) }
            : {}),
          is_active: true,
        },
      }),

      this.prisma.treatment_types.count({
        where: {
          ...(query.department_id
            ? { department_id: Number(query.department_id) }
            : {}),
          is_active: false,
        },
      }),

      this.prisma.treatment_types.findMany({
        where: query.department_id
          ? { department_id: Number(query.department_id) }
          : {},
        distinct: ['department_id'],
        select: { department_id: true },
      }),
    ]);

    const formatted = treatments.map((t) => ({
      treatment_type_id: t.treatment_type_id,
      treatment_code: t.treatment_code,
      treatment_name: t.treatment_name,
      description: t.description,
      department_id: t.department_id,
      department_name: t.departments_master.department_name,
      is_active: t.is_active,
      created_at: t.created_at,
      updated_at: t.created_at,
    }));

    return {
      data: {
        scoppedDepartment: {
          department_id: query.department_id
            ? Number(query.department_id)
            : null,
          department_name: query.department_id
            ? formatted[0].department_name
            : null,
        },
        data: formatted,
        meta: {
          total: filteredCount,
          page,
          limit,
          totalPages: Math.ceil(filteredCount / limit),
        },
        stats: {
          totalTreatments,
          activeTreatments: activeCount,
          inactiveTreatments: inactiveCount,
          departmentsWithDefinedTreatments: departmentsWithTreatments.length,
        },
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.treatment_types.findUnique({
      where: { treatment_type_id: id },
      include: {
        departments_master: true,
      },
    });
  }

  async update(id: number, dto: UpdateTreatmentTypeDto) {
    return this.prisma.treatment_types.update({
      where: { treatment_type_id: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.treatment_types.delete({
      where: { treatment_type_id: id },
    });
  }

  // ==================== Hospital-Admin ===========================
  async getMasterTreatments(hospitalId: number, query: TreatmentTypeQueryDto) {
    // const { page, limit, search, department_name } = query;
    const { search, department_name } = query;
    // const skip = (page - 1) * limit;

    const where: any = {
      is_active: true,

      /*
    Only treatments from enabled departments
    */

      departments_master: {
        hospital_departments: {
          some: {
            hospital_id: hospitalId,
            is_active: true,
          },
        },
      },

      /*
    Exclude already enabled
    */

      hospital_treatments: {
        none: {
          hospital_id: hospitalId,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          treatment_name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          treatment_code: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (department_name) {
      where.departments_master = {
        ...where.departments_master,
        department_name: {
          contains: department_name,
          mode: 'insensitive',
        },
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.treatment_types.findMany({
        where,
        // skip,
        // take: limit,

        include: {
          departments_master: true,
          hospital_treatments: true,
        },

        orderBy: {
          treatment_name: 'asc',
        },
      }),

      this.prisma.treatment_types.count({ where }),
    ]);

    const mapped = data.map((t) => ({
      treatment_type_id: t.treatment_type_id,
      treatment_code: t.treatment_code,
      treatment_name: t.treatment_name,
      description: t.description,
      department_id: t.department_id,
      department_name: t.departments_master.department_name,
      is_active: t.is_active,
      created_at: t.created_at,
      updated_at: t.modified_at,
    }));

    return {
      success: true,
      data: mapped,
      // meta: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit),
      // },
    };
  }

  async getEnabledTreatments(hospitalId: number, query: TreatmentTypeQueryDto) {
    // const { page, limit, search, department_name } = query;
    const { search, department_name } = query;

    // const skip = (page - 1) * limit;

    const where: any = {
      hospital_id: hospitalId,
    };

    if (search) {
      where.treatment_types = {
        OR: [
          {
            treatment_name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            treatment_code: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    if (department_name) {
      where.treatment_types = {
        ...where.treatment_types,
        departments_master: {
          department_name: {
            contains: department_name,
            mode: 'insensitive',
          },
        },
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.hospital_treatments.findMany({
        where,
        // skip,
        // take: limit,

        include: {
          treatment_types: {
            include: {
              departments_master: true,
            },
          },
        },
      }),

      this.prisma.hospital_treatments.count({ where }),
    ]);

    const mapped = data.map((t) => ({
      hospital_treatment_id: t.hospital_treatment_id,
      treatment_type_id: t.treatment_types.treatment_type_id,

      treatment_code: t.treatment_types.treatment_code,

      treatment_name: t.treatment_types.treatment_name,

      description: t.treatment_types.description,

      department_id: t.treatment_types.department_id,

      department_name: t.treatment_types.departments_master.department_name,

      is_active: t.treatment_types.is_active,

      created_at: t.treatment_types.created_at,

      updated_at: t.treatment_types.modified_at,

      isActive: t.is_active,
    }));

    return {
      success: true,
      data: mapped,
      // meta: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit),
      // },
    };
  }

  async getTreatmentStats(hospitalId: number) {
    const totalMaster = await this.prisma.treatment_types.count();

    const enabled = await this.prisma.hospital_treatments.findMany({
      where: { hospital_id: hospitalId },
      select: { is_active: true },
    });

    const totalEnabled = enabled.length;

    const activeCount = enabled.filter((e) => e.is_active).length;

    const inactiveCount = enabled.filter((e) => !e.is_active).length;

    return {
      success: true,
      data: {
        totalMaster,
        totalEnabled,
        activeCount,
        inactiveCount,
      },
    };
  }

  async enableTreatment(dto: EnableTreatmentDto) {
    const exists = await this.prisma.hospital_treatments.findFirst({
      where: {
        hospital_id: dto.hospitalId,
        treatment_type_id: dto.treatment_type_id,
      },
    });

    if (exists) {
      throw new BadRequestException('Treatment already enabled');
    }

    const created = await this.prisma.hospital_treatments.create({
      data: {
        hospital_id: dto.hospitalId,
        treatment_type_id: dto.treatment_type_id,
        is_active: dto.isActive,
      },
    });

    return {
      success: true,
      message: 'Treatment enabled successfully',
      data: created,
    };
  }

  async updateTreatmentStatus(id: number, dto: UpdateTreatmentStatusDto) {
    const updated = await this.prisma.hospital_treatments.update({
      where: {
        hospital_treatment_id: id,
      },

      data: {
        is_active: dto.isActive,
      },
    });

    return {
      success: true,
      message: 'Treatment status updated',
      data: updated,
    };
  }
}
