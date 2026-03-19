import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetDepartmentsDto } from './dto/get-departments.dto';
import { DepartmentQueryDto } from './dto/hospital-admin-department-query.dto';
import { UpdateDepartmentStatusDto } from './dto/update-department-status.dto';
import { EnableDepartmentDto } from './dto/enable-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto) {
    return this.prisma.departments_master.create({
      data: dto,
    });
  }

  async findAll() {
    const data = await this.prisma.departments_master.findMany({
      orderBy: { created_at: 'desc' },
    });

    return {
      data,
    };
  }

  // 🔥 SuperAdmin Endpoint (With Stats)
  async findAllSuperadmin(query: GetDepartmentsDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          department_code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          department_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [departments, totalFiltered, totalDepartments, recentlyAdded] =
      await this.prisma.$transaction([
        this.prisma.departments_master.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),

        this.prisma.departments_master.count({ where }),

        // 🔹 Stats (NOT affected by search)
        this.prisma.departments_master.count(),

        this.prisma.departments_master.count({
          where: {
            created_at: {
              gte: thirtyDaysAgo,
            },
          },
        }),
      ]);

    return {
      data: {
        data: departments,
        stats: {
          totalDepartments,
          recentlyAdded,
        },
        meta: {
          total: totalFiltered,
          page,
          limit,
          totalPages: Math.ceil(totalFiltered / limit),
        },
      },
    };
  }

  async findOne(id: number) {
    const department = await this.prisma.departments_master.findUnique({
      where: { department_id: id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    return this.prisma.departments_master.update({
      where: { department_id: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.departments_master.delete({
      where: { department_id: id },
    });
  }

  // =================Hospital-Admin=============

  async getMasterDepartments(hospitalId: number, query: DepartmentQueryDto) {
    // const { page, limit, search } = query;
    const { search } = query;

    // const skip = (page - 1) * limit;

    const enabledDepartments = await this.prisma.hospital_departments.findMany({
      where: { hospital_id: hospitalId },
      select: { department_id: true },
    });

    const enabledIds = enabledDepartments.map((d) => d.department_id);

    const where: any = {
      department_id: { notIn: enabledIds },
    };

    if (search) {
      where.OR = [
        { department_name: { contains: search, mode: 'insensitive' } },
        { department_code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.departments_master.findMany({
        where,
        // skip,
        // take: limit,
        orderBy: { department_name: 'asc' },
      }),
      this.prisma.departments_master.count({ where }),
    ]);

    return {
      success: true,
      data,
      // meta: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit),
      // },
    };
  }

  /*
  ENABLED DEPARTMENTS
  */

  async getEnabledDepartments(hospitalId: number, query: DepartmentQueryDto) {
    // const { page, limit, search } = query;
    const { search } = query;

    // const skip = (page - 1) * limit;

    const where: any = {
      hospital_id: hospitalId,
    };

    if (search) {
      where.departments_master = {
        OR: [
          { department_name: { contains: search, mode: 'insensitive' } },
          { department_code: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.hospital_departments.findMany({
        where,
        // skip,
        // take: limit,
        include: {
          departments_master: true,
        },
      }),

      this.prisma.hospital_departments.count({ where }),
    ]);

    const mapped = data.map((d) => ({
      hospital_department_id: d.hospital_department_id,
      department_id: d.departments_master.department_id,
      department_code: d.departments_master.department_code,
      department_name: d.departments_master.department_name,
      description: d.departments_master.description,
      created_at: d.departments_master.created_at,
      isActive: d.is_active,
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

  /*
  STATS API
  */

  async getDepartmentStats(hospitalId: number) {
    const totalMaster = await this.prisma.departments_master.count();

    const enabledDepartments = await this.prisma.hospital_departments.findMany({
      where: { hospital_id: hospitalId },
      select: { is_active: true },
    });

    const totalEnabled = enabledDepartments.length;

    const activeCount = enabledDepartments.filter((d) => d.is_active).length;

    const inactiveCount = enabledDepartments.filter((d) => !d.is_active).length;

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

  /*
  ENABLE DEPARTMENT
  */

  async enableDepartment(dto: EnableDepartmentDto) {
    const { hospitalId, department_id, isActive } = dto;

    const existing = await this.prisma.hospital_departments.findFirst({
      where: {
        hospital_id: hospitalId,
        department_id,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Department already enabled for this hospital',
      );
    }

    const department = await this.prisma.hospital_departments.create({
      data: {
        hospital_id: hospitalId,
        department_id,
        is_active: isActive,
      },
      include: {
        departments_master: true,
      },
    });

    return {
      success: true,
      message: 'Department enabled successfully',
      data: {
        hospital_department_id: department.hospital_department_id,
        department_id: department.departments_master.department_id,
        department_code: department.departments_master.department_code,
        department_name: department.departments_master.department_name,
        description: department.departments_master.description,
        created_at: department.departments_master.created_at,
        isActive: department.is_active,
      },
    };
  }

  /*
  UPDATE STATUS
  */

  async updateDepartmentStatus(
    hospitalDepartmentId: number,
    dto: UpdateDepartmentStatusDto,
  ) {
    const department = await this.prisma.hospital_departments.findUnique({
      where: {
        hospital_department_id: hospitalDepartmentId,
      },
    });

    if (!department) {
      throw new NotFoundException('Hospital department not found');
    }

    const updated = await this.prisma.hospital_departments.update({
      where: {
        hospital_department_id: hospitalDepartmentId,
      },
      data: {
        is_active: dto.isActive,
      },
      include: {
        departments_master: true,
      },
    });

    return {
      success: true,
      message: 'Department status updated successfully',
      data: {
        hospital_department_id: updated.hospital_department_id,
        department_id: updated.departments_master.department_id,
        department_code: updated.departments_master.department_code,
        department_name: updated.departments_master.department_name,
        description: updated.departments_master.description,
        created_at: updated.departments_master.created_at,
        isActive: updated.is_active,
      },
    };
  }
}
