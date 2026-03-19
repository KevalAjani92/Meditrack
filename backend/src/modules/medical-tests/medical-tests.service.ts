import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicalTestDto } from './dto/create-medical-test.dto';
import { GetMedicalTestDto } from './dto/get-medical-test.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateMedicalTestDto } from './dto/update-medical-test.dto';
import { TestQueryDto } from './dto/test-query-hospital-admin.dto';
import { EnableTestDto, UpdateTestStatusDto } from './dto/enable-test.dto';

@Injectable()
export class MedicalTestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalTestDto) {
    return this.prisma.tests.create({
      data: {
        ...dto,
        is_active: dto.is_active ?? true,
      },
    });
  }
  async findAll() {
    return this.prisma.tests.findMany({
      where: {
        is_active: true,
      },
      orderBy: { test_name: 'asc' },
      include: {
        departments_master: {
          select: { department_name: true },
        },
      },
    });
  }

  async findAllSuperadmin(query: GetMedicalTestDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '6');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Scoped department
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
          test_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          test_code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          test_type: {
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
      tests,
      filteredCount,
      totalTests,
      activeCount,
      inactiveCount,
      distinctCategories,
    ] = await this.prisma.$transaction([
      this.prisma.tests.findMany({
        where,
        skip,
        take: limit,
        orderBy: { test_name: 'asc' },
        include: {
          departments_master: {
            select: { department_name: true },
          },
        },
      }),

      this.prisma.tests.count({ where }),

      // Stats scoped-aware
      this.prisma.tests.count({
        where: query.department_id
          ? { department_id: Number(query.department_id) }
          : {},
      }),

      this.prisma.tests.count({
        where: {
          ...(query.department_id
            ? { department_id: Number(query.department_id) }
            : {}),
          is_active: true,
        },
      }),

      this.prisma.tests.count({
        where: {
          ...(query.department_id
            ? { department_id: Number(query.department_id) }
            : {}),
          is_active: false,
        },
      }),

      this.prisma.tests.findMany({
        where: query.department_id
          ? { department_id: Number(query.department_id) }
          : {},
        distinct: ['test_type'],
        select: { test_type: true },
      }),
    ]);

    const formatted = tests.map((t) => ({
      test_id: t.test_id,
      test_code: t.test_code,
      test_name: t.test_name,
      test_type: t.test_type,
      department_id: t.department_id,
      department_name: t.departments_master.department_name,
      description: t.description,
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
          totalTests,
          activeTests: activeCount,
          inactiveTests: inactiveCount,
          testCategoriesDistinct: distinctCategories.length,
        },
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.tests.findUnique({
      where: { test_id: id },
      include: {
        departments_master: true,
      },
    });
  }

  async update(id: number, dto: UpdateMedicalTestDto) {
    return this.prisma.tests.update({
      where: { test_id: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.tests.delete({
      where: { test_id: id },
    });
  }

  // ==================== Hospital-Admin =============================
  async getMasterTests(hospitalId: number, query: TestQueryDto) {
    const { search, department_name } = query;

    const where: any = {
      is_active: true,

      /*
    Only tests from enabled departments
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
    Exclude already enabled tests
    */

      hospital_tests: {
        none: {
          hospital_id: hospitalId,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          test_name: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          test_code: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          test_type: {
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

    const data = await this.prisma.tests.findMany({
      where,

      include: {
        departments_master: true,
      },

      orderBy: {
        test_name: 'asc',
      },
    });

    const mapped = data.map((t) => ({
      test_id: t.test_id,
      test_code: t.test_code,
      test_name: t.test_name,
      test_type: t.test_type,
      department_id: t.department_id,
      department_name: t.departments_master.department_name,
      description: t.description,
      is_active: t.is_active,
      created_at: t.created_at,
      updated_at: t.modified_at,
    }));

    return {
      success: true,
      data: mapped,
    };
  }

  async getEnabledTests(hospitalId: number, query: TestQueryDto) {
    const { search, department_name } = query;

    const where: any = {
      hospital_id: hospitalId,
    };

    if (search) {
      where.tests = {
        OR: [
          {
            test_name: {
              contains: search,
              mode: 'insensitive',
            },
          },

          {
            test_code: {
              contains: search,
              mode: 'insensitive',
            },
          },

          {
            test_type: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    if (department_name) {
      where.tests = {
        ...where.tests,
        departments_master: {
          department_name: {
            contains: department_name,
            mode: 'insensitive',
          },
        },
      };
    }

    const data = await this.prisma.hospital_tests.findMany({
      where,

      include: {
        tests: {
          include: {
            departments_master: true,
          },
        },
      },
    });

    const mapped = data.map((t) => ({
      hospital_test_id: t.hospital_test_id,

      test_id: t.tests.test_id,
      test_code: t.tests.test_code,
      test_name: t.tests.test_name,
      test_type: t.tests.test_type,

      department_id: t.tests.department_id,
      department_name: t.tests.departments_master.department_name,

      description: t.tests.description,
      is_active: t.tests.is_active,

      created_at: t.tests.created_at,
      updated_at: t.tests.modified_at,

      price: t.price,
      isActive: t.is_active,
    }));

    return {
      success: true,
      data: mapped,
    };
  }

  async getTestStats(hospitalId: number) {
    const totalMaster = await this.prisma.tests.count();

    const enabled = await this.prisma.hospital_tests.findMany({
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

  async enableTest(dto: EnableTestDto) {
    const exists = await this.prisma.hospital_tests.findFirst({
      where: {
        hospital_id: dto.hospitalId,
        test_id: dto.test_id,
      },
    });

    if (exists) {
      throw new BadRequestException('Test already enabled');
    }

    const created = await this.prisma.hospital_tests.create({
      data: {
        hospital_id: dto.hospitalId,
        test_id: dto.test_id,
        price: dto.price,
        is_active: dto.isActive,
      },
    });

    return {
      success: true,
      message: 'Test enabled successfully',
      data: created,
    };
  }

  async updateTestStatus(hospitalTestId: number, dto: UpdateTestStatusDto) {
    const updated = await this.prisma.hospital_tests.update({
      where: {
        hospital_test_id: hospitalTestId,
      },

      data: {
        is_active: dto.isActive,
        price: dto.price,
      },
    });

    return {
      success: true,
      message: 'Test updated successfully',
      data: updated,
    };
  }
}
