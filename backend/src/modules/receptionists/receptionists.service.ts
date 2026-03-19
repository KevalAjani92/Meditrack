import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
import { GetReceptionistsQueryDto } from './dto/get-receptionists-query.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ReceptionistsAdminService {
  constructor(private prisma: PrismaService) {}

  // ─── GET ALL RECEPTIONISTS (Paginated + Search + Filter + Stats)
  async getAllReceptionists(
    hospitalId: number,
    query: GetReceptionistsQueryDto,
  ) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '8');
    const skip = (page - 1) * limit;

    const role = await this.prisma.roles.findUnique({
      where: { role_name: 'Receptionist' },
    });

    if (!role) {
      throw new BadRequestException('Receptionist role not found');
    }

    const where: any = {
      role_id: role.role_id,
      employees_employees_user_idTousers: {
        hospital_id: hospitalId,
        employee_type: 'Receptionist',
      },
    };

    // 🔍 Search by name or email
    if (query.search) {
      where.OR = [
        { full_name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // 🔎 Filter by status
    if (query.status) {
      where.is_active = query.status === 'Active';
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [receptionists, filteredCount, activeCount, recentCount] =
      await this.prisma.$transaction([
        this.prisma.users.findMany({
          where,
          skip,
          take: limit,
          include: {
            employees_employees_user_idTousers: true,
          },
          orderBy: { created_at: 'desc' },
        }),

        this.prisma.users.count({ where }),

        this.prisma.users.count({
          where: { ...where, is_active: true },
        }),

        this.prisma.users.count({
          where: {
            ...where,
            created_at: { gte: thirtyDaysAgo },
          },
        }),
      ]);

    const totalReceptionists = filteredCount;

    return {
      data: {
        data: receptionists.map((r) => ({
          user_id: r.user_id,
          employee_id: r.employees_employees_user_idTousers?.employee_id,
          name: r.full_name,
          email: r.email,
          phone: r.phone_number,
          profile_image_url: r.profile_image_url,
          status: r.is_active ? 'Active' : 'Inactive',
          joined_date: r.employees_employees_user_idTousers?.joining_date
            ? new Date(r.employees_employees_user_idTousers.joining_date)
                .toISOString()
                .split('T')[0]
            : new Date(r.created_at).toISOString().split('T')[0],
          last_active: r.last_login_at
            ? this.formatLastActive(r.last_login_at)
            : 'Never',
          avatar_initials: r.full_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase(),
        })),

        meta: {
          total: filteredCount,
          page,
          limit,
          totalPages: Math.ceil(filteredCount / limit),
        },

        stats: {
          totalReceptionists,
          activeReceptionists: activeCount,
          inactiveReceptionists: totalReceptionists - activeCount,
          recentlyAdded: recentCount,
        },
      },
    };
  }

  // ─── CREATE RECEPTIONIST ───────────────────────────────────────
  async createReceptionist(
    hospitalId: number,
    dto: CreateReceptionistDto,
    createdBy: number,
  ) {
    const role = await this.prisma.roles.findUnique({
      where: { role_name: 'Receptionist' },
    });

    if (!role) {
      throw new BadRequestException('Receptionist role not found');
    }

    // Check unique email
    const emailExists = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new BadRequestException('Email is already registered');
    }

    // Check unique phone
    const phoneExists = await this.prisma.users.findUnique({
      where: { phone_number: dto.phone_number },
    });

    if (phoneExists) {
      throw new BadRequestException('Phone number is already registered');
    }

    // Generate password
    const plainPassword = randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Get hospital to find the group
    const hospital = await this.prisma.hospitals.findUnique({
      where: { hospital_id: hospitalId },
    });

    if (!hospital) {
      throw new BadRequestException('Hospital not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Create User
      const user = await tx.users.create({
        data: {
          full_name: dto.full_name,
          email: dto.email,
          phone_number: dto.phone_number,
          password_hash: hashedPassword,
          role_id: role.role_id,
          is_active: dto.is_active ?? true,
        },
      });

      // 2️⃣ Create Employee
      const employee = await tx.employees.create({
        data: {
          user_id: user.user_id,
          hospital_group_id: hospital.hospital_group_id,
          hospital_id: hospitalId,
          employee_type: 'Receptionist',
          joining_date: new Date(),
          is_active: dto.is_active ?? true,
          created_by: createdBy,
          modified_by: createdBy,
        },
      });

      return {
        message: 'Receptionist created successfully',
        data: {
          generatedPassword: plainPassword,
          user_id: user.user_id,
          employee_id: employee.employee_id,
        },
      };
    });
  }

  // ─── UPDATE RECEPTIONIST ───────────────────────────────────────
  async updateReceptionist(userId: number, dto: UpdateReceptionistDto) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      include: { employees_employees_user_idTousers: true },
    });

    if (!user) {
      throw new NotFoundException('Receptionist not found');
    }

    // Validate unique email if changing
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new BadRequestException('Email is already registered');
      }
    }

    // Validate unique phone if changing
    if (dto.phone_number && dto.phone_number !== user.phone_number) {
      const phoneExists = await this.prisma.users.findUnique({
        where: { phone_number: dto.phone_number },
      });
      if (phoneExists) {
        throw new BadRequestException('Phone number is already registered');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { user_id: userId },
        data: {
          ...(dto.full_name && { full_name: dto.full_name }),
          ...(dto.email && { email: dto.email }),
          ...(dto.phone_number && { phone_number: dto.phone_number }),
          ...(dto.is_active !== undefined && { is_active: dto.is_active }),
        },
      });

      // Also update employee active status
      if (
        dto.is_active !== undefined &&
        user.employees_employees_user_idTousers
      ) {
        await tx.employees.update({
          where: {
            employee_id:
              user.employees_employees_user_idTousers.employee_id,
          },
          data: { is_active: dto.is_active },
        });
      }

      return { message: 'Receptionist updated successfully' };
    });
  }

  // ─── TOGGLE STATUS ─────────────────────────────────────────────
  async toggleReceptionistStatus(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      include: { employees_employees_user_idTousers: true },
    });

    if (!user) {
      throw new NotFoundException('Receptionist not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { user_id: userId },
        data: { is_active: !user.is_active },
      });

      if (user.employees_employees_user_idTousers) {
        await tx.employees.update({
          where: {
            employee_id:
              user.employees_employees_user_idTousers.employee_id,
          },
          data: { is_active: !user.is_active },
        });
      }

      return {
        message: `Receptionist ${!user.is_active ? 'activated' : 'deactivated'} successfully`,
      };
    });
  }

  // ─── RESET PASSWORD ────────────────────────────────────────────
  async resetReceptionistPassword(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('Receptionist not found');
    }

    const plainPassword = randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await this.prisma.users.update({
      where: { user_id: userId },
      data: {
        password_hash: hashedPassword,
        password_changed_at: new Date(),
      },
    });

    return {
      message: 'Password reset successfully',
      data: {
        generatedPassword: plainPassword,
      },
    };
  }

  // ─── HELPER ────────────────────────────────────────────────────
  private formatLastActive(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  }
}
