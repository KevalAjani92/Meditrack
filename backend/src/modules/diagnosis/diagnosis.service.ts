import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetDiagnosisDto } from './dto/get-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { UpdateDiagnosisStatusDto } from './dto/update-diagnosis-status.dto';
import { EnableDiagnosisDto } from './dto/enable-diagnosis.dto';
import { DiagnosisQueryDto } from './dto/hospital-admin-diagnosis-query.dto';

@Injectable()
export class DiagnosisService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDiagnosisDto) {
    return this.prisma.diagnoses.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.diagnoses.findMany({
      orderBy: { diagnosis_name: 'asc' },
      include: {
        departments_master: {
          select: {
            department_name: true,
          },
        },
      },
    });
  }

  async findAllSuperadmin(query: GetDiagnosisDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '6');
    const skip = (page - 1) * limit;

    const baseWhere: any = {};

    // 🔎 Scoped Filter
    if (query.department_id) {
      baseWhere.department_id = Number(query.department_id);
    }

    // 🔍 Search Filter
    if (query.search) {
      baseWhere.OR = [
        {
          diagnosis_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          diagnosis_code: {
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // ⚡ Transaction
    const [
      diagnoses,
      filteredCount,

      // Stats (dynamic depending on scope)
      totalDiagnoses,
      recentlyAdded,
      activeDepartments,
    ] = await this.prisma.$transaction([
      // 🔹 Paginated Data
      this.prisma.diagnoses.findMany({
        where: baseWhere,
        skip,
        take: limit,
        orderBy: { diagnosis_name: 'asc' },
        include: {
          departments_master: {
            select: {
              department_name: true,
            },
          },
        },
      }),

      this.prisma.diagnoses.count({ where: baseWhere }),

      // 🔥 STATS BASED ON SCOPE
      this.prisma.diagnoses.count({
        where: query.department_id
          ? { department_id: Number(query.department_id) }
          : {},
      }),

      this.prisma.diagnoses.count({
        where: {
          ...(query.department_id
            ? { department_id: Number(query.department_id) }
            : {}),
          created_at: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      this.prisma.diagnoses.findMany({
        where: query.department_id
          ? { department_id: Number(query.department_id) }
          : {},
        select: { department_id: true },
      }),
    ]);

    const formatted = diagnoses.map((d) => ({
      diagnosis_id: d.diagnosis_id,
      diagnosis_code: d.diagnosis_code,
      diagnosis_name: d.diagnosis_name,
      description: d.description,
      department_id: d.department_id,
      department_name: d.departments_master.department_name,
      status: 'Active',
      created_at: d.created_at,
      updated_at: d.created_at,
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
          totalDiagnoses,
          recentlyAdded,
          activeDepartments: activeDepartments.length,
        },
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.diagnoses.findUnique({
      where: { diagnosis_id: id },
      include: {
        departments_master: true,
      },
    });
  }

  async update(id: number, dto: UpdateDiagnosisDto) {
    return this.prisma.diagnoses.update({
      where: { diagnosis_id: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.diagnoses.delete({
      where: { diagnosis_id: id },
    });
  }

  // ================== Hospital-Admin ===================
  /*
  MASTER DIAGNOSIS
  */

  async getMasterDiagnoses(hospitalId: number, query: DiagnosisQueryDto) {
    // const { page, limit, search, department_name } = query;
    const { search, department_name } = query;

    // const skip = (page - 1) * limit;

    /*
  Step 1
  Get enabled departments
  */

    const enabledDepartments = await this.prisma.hospital_departments.findMany({
      where: {
        hospital_id: hospitalId,
        is_active: true,
      },
      select: {
        department_id: true,
      },
    });

    const departmentIds = enabledDepartments.map((d) => d.department_id);

    if (departmentIds.length === 0) {
      return {
        success: true,
        data: [],
        // meta: {
        //   total: 0,
        //   page,
        //   limit,
        //   totalPages: 0,
        // },
      };
    }

    /*
  Step 2
  Get already enabled diagnoses
  */

    const enabledDiagnoses = await this.prisma.hospital_diagnoses.findMany({
      where: {
        hospital_id: hospitalId,
      },
      select: {
        diagnosis_id: true,
      },
    });

    const enabledIds = enabledDiagnoses.map((d) => d.diagnosis_id);

    /*
  Step 3
  Build where clause
  */

    const where: any = {
      department_id: {
        in: departmentIds,
      },

      diagnosis_id: {
        notIn: enabledIds,
      },
    };

    if (search) {
      where.OR = [
        { diagnosis_name: { contains: search, mode: 'insensitive' } },
        { diagnosis_code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (department_name) {
      where.departments_master = {
        department_name: { contains: department_name, mode: 'insensitive' },
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.diagnoses.findMany({
        where,
        // skip,
        // take: limit,
        include: {
          departments_master: true,
        },
        orderBy: {
          diagnosis_name: 'asc',
        },
      }),

      this.prisma.diagnoses.count({ where }),
    ]);

    const mapped = data.map((d) => ({
      diagnosis_id: d.diagnosis_id,
      diagnosis_code: d.diagnosis_code,
      diagnosis_name: d.diagnosis_name,
      description: d.description,
      department_id: d.department_id,
      department_name: d.departments_master.department_name,
      status: 'Active',
      created_at: d.created_at,
      updated_at: d.modified_at,
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
  ENABLED DIAGNOSIS
  */

  async getEnabledDiagnoses(hospitalId: number, query: DiagnosisQueryDto) {
    // const { page, limit, search, department_name } = query;
    const { search, department_name } = query;

    // const skip = (page - 1) * limit;

    const where: any = {
      hospital_id: hospitalId,
    };

    if (search) {
      where.diagnoses = {
        OR: [
          { diagnosis_name: { contains: search, mode: 'insensitive' } },
          { diagnosis_code: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    if (department_name) {
      where.diagnoses = {
        ...where.diagnoses,
        departments_master: {
          department_name: {
            contains: department_name,
            mode: 'insensitive',
          },
        },
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.hospital_diagnoses.findMany({
        where,
        // skip,
        // take: limit,
        include: {
          diagnoses: {
            include: {
              departments_master: true,
            },
          },
        },
      }),

      this.prisma.hospital_diagnoses.count({ where }),
    ]);

    const mapped = data.map((d) => ({
      hospital_diagnosis_id: d.hospital_diagnosis_id,
      diagnosis_id: d.diagnoses.diagnosis_id,
      diagnosis_code: d.diagnoses.diagnosis_code,
      diagnosis_name: d.diagnoses.diagnosis_name,
      description: d.diagnoses.description,
      department_id: d.diagnoses.department_id,
      department_name: d.diagnoses.departments_master.department_name,
      status: d.is_active ? 'Active' : 'Archived',
      created_at: d.diagnoses.created_at,
      updated_at: d.diagnoses.modified_at,
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
  STATS
  */

  async getDiagnosisStats(hospitalId: number) {
    const totalMaster = await this.prisma.diagnoses.count();

    const enabled = await this.prisma.hospital_diagnoses.findMany({
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

  /*
  ENABLE DIAGNOSIS
  */

  async enableDiagnosis(dto: EnableDiagnosisDto) {
    const existing = await this.prisma.hospital_diagnoses.findFirst({
      where: {
        hospital_id: dto.hospitalId,
        diagnosis_id: dto.diagnosis_id,
      },
    });

    if (existing) {
      throw new BadRequestException('Diagnosis already enabled for hospital');
    }

    const created = await this.prisma.hospital_diagnoses.create({
      data: {
        hospital_id: dto.hospitalId,
        diagnosis_id: dto.diagnosis_id,
        is_active: dto.isActive,
      },
      include: {
        diagnoses: {
          include: {
            departments_master: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Diagnosis enabled successfully',
      data: created,
    };
  }

  /*
  UPDATE STATUS
  */

  async updateDiagnosisStatus(id: number, dto: UpdateDiagnosisStatusDto) {
    const diagnosis = await this.prisma.hospital_diagnoses.findUnique({
      where: { hospital_diagnosis_id: id },
    });

    if (!diagnosis) {
      throw new NotFoundException('Hospital diagnosis not found');
    }

    const updated = await this.prisma.hospital_diagnoses.update({
      where: { hospital_diagnosis_id: id },
      data: { is_active: dto.isActive },
    });

    return {
      success: true,
      message: 'Diagnosis status updated successfully',
      data: updated,
    };
  }
}
