import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateGroupAdminDto } from './dto/create-group-admin.dto';
import { UpdateGroupAdminDto } from './dto/update-group-admin.dto';
import { GetGroupAdminsDto } from './dto/get-group-admins.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateTemporaryPassword } from 'utils/password-generator';

@Injectable()
export class GroupAdminsService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateGroupAdminDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Get Role
      const role = await tx.roles.findUnique({
        where: { role_name: 'GroupAdmin' },
      });

      if (!role) {
        throw new Error('GroupAdmin role not found');
      }

      // 2️⃣ Generate Temporary Password
      const tempPassword = generateTemporaryPassword(10);

      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // 3️⃣ Create User
      const user = await tx.users.create({
        data: {
          full_name: dto.full_name,
          email: dto.email,
          phone_number: dto.phone_number,
          password_hash: hashedPassword,
          role_id: role.role_id,
          is_active: dto.is_active ?? true,
          password_changed_at: null, // 🔥 force reset
        },
      });

      // 4️⃣ Create Employee Record
      const employee = await tx.employees.create({
        data: {
          user_id: user.user_id,
          employee_type: 'GroupAdmin',
          hospital_group_id: dto.hospital_group_id ?? null,
          joining_date: new Date(),
          is_active: true,
        },
      });

      // TODO: Send tempPassword via email/SMS here

      return {
        message: 'Group Admin created successfully',
        data: {
          user_id: user.user_id,
          employee_id: employee.employee_id,

          // ⚠ Return temp password ONLY to SuperAdmin
          temporary_password: tempPassword,
          note: 'User must change password on first login',
        },
      };
    });
  }

  async findAll() {
    // 1️⃣ Get GroupAdmin role_id dynamically (production safe)
    const groupAdminRole = await this.prisma.roles.findUnique({
      where: { role_name: 'GroupAdmin' },
      select: { role_id: true },
    });

    if (!groupAdminRole) {
      throw new Error('GroupAdmin role not found');
    }

    const where: any = {
      role_id: groupAdminRole.role_id,
    };

    const admins = await this.prisma.users.findMany({
      where: where,
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        profile_image_url: true,
        employees_employees_user_idTousers: {
          select: {
            employee_id: true,
            hospital_group_id: true,
            hospital_groups: {
              select: {
                group_name: true,
              },
            },
          },
        },
      },
    });
    return admins.map((admin) => ({
      user_id: admin.user_id,
      full_name: admin.full_name,
      email: admin.email,
      phone_number: admin.phone_number,
      profile_image_url: admin.profile_image_url,
      employee_id:
        admin.employees_employees_user_idTousers?.employee_id ?? null,
      hospital_group_id:
        admin.employees_employees_user_idTousers?.hospital_group_id ?? null,
      group_name:
        admin.employees_employees_user_idTousers?.hospital_groups?.group_name ??
        null,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} groupAdmin`;
  }

  async getStats() {
    // 1️⃣ Get GroupAdmin role_id
    const role = await this.prisma.roles.findUnique({
      where: { role_name: 'GroupAdmin' },
      select: { role_id: true },
    });

    if (!role) {
      throw new Error('GroupAdmin role not found');
    }

    const roleId = role.role_id;

    const [totalAdmins, activeAdmins, inactiveAdmins, assignedGroups] =
      await this.prisma.$transaction([
        // 🔹 Total Admins
        this.prisma.users.count({
          where: { role_id: roleId },
        }),

        // 🔹 Active
        this.prisma.users.count({
          where: {
            role_id: roleId,
            is_active: true,
          },
        }),

        // 🔹 Inactive
        this.prisma.users.count({
          where: {
            role_id: roleId,
            is_active: false,
          },
        }),

        // 🔹 Assigned Groups (Distinct)
        this.prisma.employees.findMany({
          where: {
            employee_type: 'GroupAdmin',
            hospital_group_id: { not: null },
          },
          distinct: ['hospital_group_id'],
          select: {
            hospital_group_id: true,
          },
        }),
      ]);

    return {
      data: {
        totalAdmins,
        activeAdmins,
        inactiveAdmins,
        assignedGroups: assignedGroups.length,
      },
    };
  }

  async getAllGroupAdmins(query: GetGroupAdminsDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // 1️⃣ Get GroupAdmin role_id dynamically (production safe)
    const groupAdminRole = await this.prisma.roles.findUnique({
      where: { role_name: 'GroupAdmin' },
      select: { role_id: true },
    });

    if (!groupAdminRole) {
      throw new Error('GroupAdmin role not found');
    }

    const where: any = {
      role_id: groupAdminRole.role_id,
    };

    // 🔍 Search filter (name, email)
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
      ];
    }

    // 🔵 Status Filter
    if (query.status && query.status !== 'All') {
      where.is_active = query.status === 'Active';
    }

    const [admins, total] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          user_id: true,
          full_name: true,
          email: true,
          phone_number: true,
          profile_image_url: true,
          is_active: true,
          last_login_at: true,
          created_at: true,

          employees_employees_user_idTousers: {
            select: {
              employee_id: true,
              joining_date: true,
              hospital_group_id: true,
              hospital_groups: {
                select: {
                  group_name: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.users.count({ where }),
    ]);

    // 🎯 Transform response
    const formatted = admins.map((admin) => ({
      user_id: admin.user_id,
      full_name: admin.full_name,
      email: admin.email,
      phone_number: admin.phone_number,
      profile_image_url: admin.profile_image_url,

      employee_id:
        admin.employees_employees_user_idTousers?.employee_id || null,

      hospital_group_id:
        admin.employees_employees_user_idTousers?.hospital_group_id || null,

      group_name:
        admin.employees_employees_user_idTousers?.hospital_groups?.group_name ||
        null,

      is_active: admin.is_active,
      joined_date:
        admin.employees_employees_user_idTousers?.joining_date ||
        admin.created_at,

      last_login_at: admin.last_login_at,
    }));

    return {
      data: {
        data: formatted,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async update(userId: number, dto: UpdateGroupAdminDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Update user table
      await tx.users.update({
        where: { user_id: userId },
        data: {
          full_name: dto.full_name,
          email: dto.email,
          phone_number: dto.phone_number,
          is_active: dto.is_active,
        },
      });

      // 2️⃣ Update employee (group assignment)
      if (dto.hospital_group_id !== undefined) {
        await tx.employees.update({
          where: { user_id: userId },
          data: {
            hospital_group_id: dto.hospital_group_id,
          },
        });
      }

      return {
        message: 'Group Admin updated successfully',
      };
    });
  }

  remove(id: number) {
    return `This action removes a #${id} groupAdmin`;
  }

  async assignAdmin(groupId: number, adminUserId: number | null) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Validate group
      const group = await tx.hospital_groups.findUnique({
        where: { hospital_group_id: groupId },
      });

      if (!group) {
        throw new NotFoundException('Hospital group not found');
      }

      // 2️⃣ Find existing admin of this group
      const currentGroupAdmin = await tx.employees.findFirst({
        where: {
          hospital_group_id: groupId,
          employee_type: 'GroupAdmin',
        },
      });

      // ==========================
      // 🔴 CASE A: UNASSIGN
      // ==========================
      if (adminUserId === null) {
        if (currentGroupAdmin) {
          await tx.employees.update({
            where: { employee_id: currentGroupAdmin.employee_id },
            data: { hospital_group_id: null },
          });
        }

        return {
          message: 'Group admin unassigned successfully',
        };
      }

      // ==========================
      // 🟢 CASE B: ASSIGN / TRANSFER
      // ==========================

      // 3️⃣ Get GroupAdmin role
      const role = await tx.roles.findUnique({
        where: { role_name: 'GroupAdmin' },
      });

      if (!role) {
        throw new Error('GroupAdmin role not found');
      }

      // 4️⃣ Validate user role AND active status
      const user = await tx.users.findFirst({
        where: {
          user_id: adminUserId,
          role_id: role.role_id,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid GroupAdmin');
      }

      if (!user.is_active) {
        throw new BadRequestException(
          'Inactive or suspended admin cannot be assigned to a group',
        );
      }

      // 5️⃣ Get employee record
      const employee = await tx.employees.findUnique({
        where: { user_id: adminUserId },
      });

      if (!employee) {
        throw new BadRequestException('Employee record not found');
      }

      // 6️⃣ Unassign old admin of this group
      if (currentGroupAdmin) {
        await tx.employees.update({
          where: { employee_id: currentGroupAdmin.employee_id },
          data: { hospital_group_id: null },
        });
      }

      // 7️⃣ If this admin is assigned elsewhere → remove
      if (employee.hospital_group_id) {
        await tx.employees.update({
          where: { employee_id: employee.employee_id },
          data: { hospital_group_id: null },
        });
      }

      // 8️⃣ Assign to current group
      await tx.employees.update({
        where: { employee_id: employee.employee_id },
        data: { hospital_group_id: groupId },
      });

      return {
        message: 'Group admin assigned successfully',
        user_id: adminUserId,
        hospital_group_id: groupId,
      };
    });
  }
}
