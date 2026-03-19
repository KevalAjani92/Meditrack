import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProcedureDto } from './dto/get-procedure.dto';
import { ProcedureQueryDto } from './dto/procedure-query-hospital-admin.dto';
import {
  EnableProcedureDto,
  UpdateProcedureDetailDto,
} from './dto/enable-procedure.dto';

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  async create(treatmentId: number, dto: CreateProcedureDto) {
    return this.prisma.procedures.create({
      data: {
        ...dto,
        treatment_type_id: treatmentId,
        is_active: dto.is_active ?? true,
      },
    });
  }

  async findAllSuperadmin(treatmentId: number, query: GetProcedureDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '5');
    const skip = (page - 1) * limit;

    const where: any = {
      treatment_type_id: treatmentId,
    };

    // 🔍 Search
    if (query.search) {
      where.OR = [
        {
          procedure_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          procedure_code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 🔎 Filter by type
    if (query.type === 'Surgical') {
      where.is_surgical = true;
    }

    if (query.type === 'Non-Surgical') {
      where.is_surgical = false;
    }

    const [
      procedures,
      filteredCount,
      activeCount,
      inactiveCount,
      surgicalCount,
      treatmentDetail,
    ] = await this.prisma.$transaction([
      // Paginated Data
      this.prisma.procedures.findMany({
        where,
        skip,
        take: limit,
        orderBy: { procedure_name: 'asc' },
      }),

      this.prisma.procedures.count({ where }),

      this.prisma.procedures.count({
        where: { ...where, is_active: true },
      }),

      this.prisma.procedures.count({
        where: { ...where, is_active: false },
      }),

      this.prisma.procedures.count({
        where: { ...where, is_surgical: true },
      }),

      this.prisma.treatment_types.findUnique({
        where: { treatment_type_id: treatmentId },
        include: {
          departments_master: {
            select: { department_name: true },
          },
        },
      }),
    ]);

    return {
      data: {
        treatmentDetail: {
          treatment_type_id: treatmentDetail?.treatment_type_id,
          treatment_code: treatmentDetail?.treatment_code,
          treatment_name: treatmentDetail?.treatment_name,
          description: treatmentDetail?.description,
          department_name: treatmentDetail?.departments_master.department_name,
          is_active: treatmentDetail?.is_active,
          updated_at: treatmentDetail?.modified_at,
        },

        procedures,

        meta: {
          total: filteredCount,
          page,
          limit,
          totalPages: Math.ceil(filteredCount / limit),
        },

        stats: {
          totalProcedures: filteredCount,
          activeProcedures: activeCount,
          inactiveProcedures: inactiveCount,
          surgicalProcedures: surgicalCount,
        },
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.procedures.findUnique({
      where: { procedure_id: id },
    });
  }

  async update(id: number, dto: UpdateProcedureDto) {
    return this.prisma.procedures.update({
      where: { procedure_id: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.procedures.delete({
      where: { procedure_id: id },
    });
  }

  // ================= Hospital-Admin =================
  async getMasterProcedures(
    hospitalId: number,
    treatmentTypeId: number,
    query: ProcedureQueryDto,
  ) {
    const { search, type } = query;

    const where: any = {
      treatment_type_id: treatmentTypeId,

      hospital_procedures: {
        none: {
          hospital_id: hospitalId,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          procedure_name: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          procedure_code: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (type) {
      where.is_surgical = type.toLowerCase() === 'surgical';
    }

    const data = await this.prisma.procedures.findMany({
      where,

      orderBy: {
        procedure_name: 'asc',
      },
    });

    return {
      success: true,
      data,
    };
  }

  async getEnabledProcedures(
    hospitalId: number,
    treatmentTypeId: number,
    query: ProcedureQueryDto,
  ) {
    const { search, type } = query;

    const where: any = {
      hospital_id: hospitalId,
    };

    if (search) {
      where.procedures = {
        OR: [
          {
            procedure_name: {
              contains: search,
              mode: 'insensitive',
            },
          },

          {
            procedure_code: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    if (type) {
      where.procedures = {
        ...where.procedures,
        is_surgical: type.toLowerCase() === 'surgical',
      };
    }

    const data = await this.prisma.hospital_procedures.findMany({
      where,

      include: {
        procedures: true,
      },
    });

    const mapped = data
      .filter((p) => p.procedures.treatment_type_id === treatmentTypeId)
      .map((p) => ({
        hospital_procedure_id: p.hospital_procedure_id,

        procedure_id: p.procedures.procedure_id,
        procedure_code: p.procedures.procedure_code,
        procedure_name: p.procedures.procedure_name,
        description: p.procedures.description,
        treatment_type_id: p.procedures.treatment_type_id,
        is_surgical: p.procedures.is_surgical,
        is_active: p.procedures.is_active,

        created_at: p.procedures.created_at,
        updated_at: p.procedures.modified_at,

        price: p.price,
        isActive: p.is_active,
      }));

    return {
      success: true,
      data: mapped,
    };
  }

  async enableProcedure(dto: EnableProcedureDto) {
    const exists = await this.prisma.hospital_procedures.findFirst({
      where: {
        hospital_id: dto.hospitalId,
        procedure_id: dto.procedure_id,
      },
    });

    if (exists) {
      throw new BadRequestException('Procedure already enabled');
    }

    const created = await this.prisma.hospital_procedures.create({
      data: {
        hospital_id: dto.hospitalId,
        procedure_id: dto.procedure_id,

        price: dto.price,
        is_active: dto.isActive,
      },
    });

    return {
      success: true,
      message: 'Procedure enabled successfully',
      data: created,
    };
  }

  async updateProcedure(id: number, dto: UpdateProcedureDetailDto) {
    const updated = await this.prisma.hospital_procedures.update({
      where: {
        hospital_procedure_id: id,
      },

      data: {
        price: dto.price,
        is_active: dto.isActive,
      },
    });

    return {
      success: true,
      message: 'Procedure updated',
      data: updated,
    };
  }

  async getProcedureStats(hospitalId: number, treatmentTypeId: number) {
    const totalMaster = await this.prisma.procedures.count({
      where: {
        treatment_type_id: treatmentTypeId,
      },
    });

    const enabled = await this.prisma.hospital_procedures.findMany({
      where: { hospital_id: hospitalId },

      include: {
        procedures: true,
      },
    });

    const filtered = enabled.filter(
      (p) => p.procedures.treatment_type_id === treatmentTypeId,
    );

    const totalEnabled = filtered.length;

    const activeCount = filtered.filter((p) => p.is_active).length;

    const inactiveCount = filtered.filter((p) => !p.is_active).length;

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

  async getTreatmentDetail(treatmentTypeId: number) {
    const data = await this.prisma.treatment_types.findUnique({
      where: {
        treatment_type_id: treatmentTypeId,
      },

      include: {
        departments_master: true,
      },
    });

    return {
      success: true,

      data: {
        treatment_type_id: data?.treatment_type_id,
        treatment_code: data?.treatment_code,
        treatment_name: data?.treatment_name,
        description: data?.description,
        department_name: data?.departments_master.department_name,
        is_active: data?.is_active,
        updated_at: data?.modified_at,
      },
    };
  }
}
