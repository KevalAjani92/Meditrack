import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHospitalAdminDto } from './dto/create-hospital-admin.dto';
import { UpdateHospitalAdminDto } from './dto/update-hospital-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetHospitalAdminDto } from './dto/get-hospital-admin.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HospitalAdminsService {
  constructor(private prisma: PrismaService) {}

  private GROUP_ID = 1;

  async findAll() {
    const role = await this.prisma.roles.findUnique({
      where: { role_name: 'HospitalAdmin' },
    });

    if (!role) {
      throw new BadRequestException('HospitalAdmin role not found');
    }

    const where: any = {
      role_id: role.role_id,
      employees_employees_user_idTousers: {
        hospital_groups: {
          hospital_group_id: this.GROUP_ID,
        },
      },
    };
    return this.prisma.users.findMany({
      where,
      include: {
        employees_employees_user_idTousers: {
          include: {
            hospitals: true,
          },
        },
      },
    });
  }

  async getAllHospitalAdmin(query: GetHospitalAdminDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '4');
    const skip = (page - 1) * limit;

    const role = await this.prisma.roles.findUnique({
      where: { role_name: 'HospitalAdmin' },
    });

    if (!role) {
      throw new BadRequestException('HospitalAdmin role not found');
    }

    const where: any = {
      role_id: role.role_id,
      employees_employees_user_idTousers: {
        hospital_groups: {
          hospital_group_id: this.GROUP_ID,
        },
      },
    };

    // 🔍 Search
    if (query.search) {
      where.OR = [
        {
          full_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          employees_employees_user_idTousers: {
            hospitals: {
              hospital_name: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    // 🔎 Status filter
    if (query.status) {
      where.is_active = query.status === 'Active';
    }

    const [
      admins,
      filteredCount,
      activeCount,
      unassignedCount,
      hospitalsWithoutAdmin,
    ] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        include: {
          employees_employees_user_idTousers: {
            include: {
              hospitals: true,
            },
          },
        },
      }),

      this.prisma.users.count({ where }),

      this.prisma.users.count({
        where: { ...where, is_active: true },
      }),

      this.prisma.users.count({
        where: {
          ...where,
          employees_employees_user_idTousers: {
            hospital_id: null,
          },
        },
      }),

      // Hospitals in group 1 without admin
      this.prisma.hospitals.count({
        where: {
          hospital_group_id: this.GROUP_ID,
          employees: {
            none: {
              employee_type: 'HospitalAdmin',
            },
          },
        },
      }),
    ]);

    return {
      data: {
        data: admins.map((a) => ({
          user_id: a.user_id,
          full_name: a.full_name,
          email: a.email,
          phone_number: a.phone_number,
          profile_image_url: a.profile_image_url,
          employee_id: a.employees_employees_user_idTousers?.employee_id,
          hospital_id:
            a.employees_employees_user_idTousers?.hospital_id || null,
          hospital_name:
            a.employees_employees_user_idTousers?.hospitals?.hospital_name ||
            null,
          is_active: a.is_active,
          last_active: a.last_login_at,
          joined_date: a.employees_employees_user_idTousers?.joining_date,
        })),

        meta: {
          total: filteredCount,
          page,
          limit,
          totalPages: Math.ceil(filteredCount / limit),
        },

        stats: {
          totalAdmins: filteredCount,
          activeAdmins: activeCount,
          unassignedAdmins: unassignedCount,
          hospitalsWithoutAdmins: hospitalsWithoutAdmin,
        },
      },
    };
  }

  async toggleStatus(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      include: {
        employees_employees_user_idTousers: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Update User
      await tx.users.update({
        where: { user_id: userId },
        data: {
          is_active: !user.is_active,
        },
      });

      // 2️⃣ Update Employee (hospital reassignment)
      if (user.employees_employees_user_idTousers?.hospital_id !== null) {
        if (!user.employees_employees_user_idTousers) {
          throw new NotFoundException('Employee record not found');
        }
        await tx.employees.update({
          where: {
            employee_id: user.employees_employees_user_idTousers.employee_id,
          },
          data: {
            is_active: !user.is_active,
          },
        });
      }
    });
  }

  async create(dto: CreateHospitalAdminDto) {
    const GROUP_ID = this.GROUP_ID;

    // 🔎 Get Role
    const role = await this.prisma.roles.findUnique({
      where: { role_name: 'HospitalAdmin' },
    });

    if (!role) {
      throw new BadRequestException('HospitalAdmin role not found');
    }

    // 🔎 Validate hospital belongs to this group (if provided)
    if (dto.hospital_id) {
      const hospital = await this.prisma.hospitals.findFirst({
        where: {
          hospital_id: dto.hospital_id,
          hospital_group_id: GROUP_ID,
        },
      });

      if (!hospital) {
        throw new BadRequestException('Hospital does not belong to this group');
      }
    }

    // 🔐 Generate Password
    const plainPassword = randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Create User
      const user = await tx.users.create({
        data: {
          full_name: dto.full_name,
          email: dto.email,
          phone_number: dto.phone_number,
          password_hash: hashedPassword,
          role_id: role.role_id,
          is_active: dto.is_active,
        },
      });

      // 2️⃣ Create Employee
      const employee = await tx.employees.create({
        data: {
          user_id: user.user_id,
          hospital_group_id: GROUP_ID,
          hospital_id: dto.hospital_id ?? null,
          employee_type: 'HospitalAdmin',
          joining_date: new Date(),
          is_active: dto.is_active,
        },
      });

      return {
        message: 'Hospital Admin created successfully',
        generatedPassword: plainPassword, // send once
        user_id: user.user_id,
        employee_id: employee.employee_id,
      };
    });
  }

  async update(userId: number, dto: UpdateHospitalAdminDto) {
    const GROUP_ID = this.GROUP_ID;

    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      include: {
        employees_employees_user_idTousers: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Hospital Admin not found');
    }

    // 🔎 Validate hospital if updating
    if (dto.hospital_id !== undefined) {
      if (dto.hospital_id !== null) {
        const hospital = await this.prisma.hospitals.findFirst({
          where: {
            hospital_id: dto.hospital_id,
            hospital_group_id: GROUP_ID,
          },
        });

        if (!hospital) {
          throw new BadRequestException(
            'Hospital does not belong to this group',
          );
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Update User
      await tx.users.update({
        where: { user_id: userId },
        data: {
          full_name: dto.full_name,
          email: dto.email,
          phone_number: dto.phone_number,
          is_active: dto.is_active,
        },
      });

      // 2️⃣ Update Employee (hospital reassignment)
      if (dto.hospital_id !== undefined) {
        if (!user.employees_employees_user_idTousers) {
          throw new NotFoundException('Employee record not found');
        }
        await tx.employees.update({
          where: {
            employee_id: user.employees_employees_user_idTousers.employee_id,
          },
          data: {
            hospital_id: dto.hospital_id,
            is_active: dto.is_active,
          },
        });
      }

      return {
        message: 'Hospital Admin updated successfully',
      };
    });
  }
}
