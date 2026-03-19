import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetGroupsDto } from './dto/get-groups.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroupStats() {
    const today = new Date();

    // 30 days from today (for expiring soon)
    const expiringSoonDate = new Date();
    expiringSoonDate.setDate(today.getDate() + 30);

    const [totalGroups, activeGroups, inactiveGroups, expiringSoonGroups = 0] =
      await this.prisma.$transaction([
        // ✅ Total Groups (No filter)
        this.prisma.hospital_groups.count(),

        // ✅ Active Groups
        this.prisma.hospital_groups.count({
          where: {
            is_active: true,
          },
        }),

        // ✅ Inactive Groups
        this.prisma.hospital_groups.count({
          where: {
            is_active: false,
          },
        }),

        // // ✅ Expiring Soon (within next 30 days)
        // this.prisma.hospital_groups.count({
        //   where: {
        //     subscriptionEndDate: {
        //       gte: today,
        //       lte: expiringSoonDate,
        //     },
        //   },
        // }),
      ]);

    return {
      message: 'Group statistics fetched successfully',
      data: {
        total: totalGroups,
        active: activeGroups,
        inactive: inactiveGroups,
        expiringSoon: expiringSoonGroups,
      },
    };
  }

  async getAllGroups() {
    const groups = await this.prisma.hospital_groups.findMany({
      orderBy: { group_name: 'asc' },
      select: {
        hospital_group_id: true,
        group_name: true,
      },
    });

    return {
      message: 'All groups fetched successfully',
      data: groups.map((group) => ({
        group_id: group.hospital_group_id,
        group_name: group.group_name,
      })),
    };
  }

  async getGroups(query: GetGroupsDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '6');
    const skip = (page - 1) * limit;

    const where: any = {};

    // 🔍 Search Filter
    if (query.search) {
      where.OR = [
        {
          group_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          group_code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          registration_no: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          contact_email: {
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

    // ⚡ Optimized Query (NO N+1)
    const [groups, total] = await this.prisma.$transaction([
      this.prisma.hospital_groups.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          hospital_group_id: true,
          group_name: true,
          group_code: true,
          registration_no: true,
          description: true,
          contact_phone: true,
          contact_email: true,
          is_active: true,
          created_at: true,
          created_by: true,

          // 🔹 Correct Relation Name Based On Your Schema
          employees: {
            where: {
              employee_type: 'GroupAdmin',
              is_active: true,
            },
            take: 1,
            select: {
              users_employees_user_idTousers: {
                select: {
                  user_id: true,
                  full_name: true,
                },
              },
            },
          },

          _count: {
            select: {
              employees: true,
              hospitals: true,
            },
          },
        },
      }),

      this.prisma.hospital_groups.count({ where }),
    ]);

    // 🔄 Format Response
    const formatted = groups.map((group) => {
      const admin = group.employees[0]?.users_employees_user_idTousers;

      return {
        group_id: group.hospital_group_id,

        group_name: group.group_name,
        group_code: group.group_code || '',
        registration_no: group.registration_no || '',
        description: group.description || '',
        contact_phone: group.contact_phone || '',
        contact_email: group.contact_email || '',

        admin_id: admin?.user_id?.toString() || null,
        adminName: admin?.full_name || 'Unassigned',

        hospitalCount: group._count.hospitals,
        userCount: group._count.employees,

        status: group.is_active ? 'Active' : 'Inactive',

        subscriptionStatus: 'Active',
        subscriptionEndDate: '2026-12-31T00:00:00.000Z',

        createdAt: group.created_at,
      };
    });

    return {
      message: 'Groups fetched successfully',
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

  // ✅ CREATE
  async createGroup(dto: CreateGroupDto) {
    try {
      const group = await this.prisma.hospital_groups.create({
        data: {
          group_name: dto.group_name,
          group_code: dto.group_code,
          description: dto.description,
          registration_no: dto.registration_no,
          contact_phone: dto.contact_phone,
          contact_email: dto.contact_email,
          created_by: 1, // replace with logged-in user ID
          modified_by: 1,
        },
      });

      return {
        message: 'Hospital group created successfully',
        data: group,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Group name, code, or registration number already exists',
          );
        }
      }

      throw error;
    }
  }

  // ✅ UPDATE
  async updateGroup(id: number, dto: UpdateGroupDto) {
    const existing = await this.prisma.hospital_groups.findUnique({
      where: { hospital_group_id: id },
    });

    if (!existing) {
      throw new NotFoundException('Hospital group not found');
    }

    try {
      const updated = await this.prisma.hospital_groups.update({
        where: { hospital_group_id: id },
        data: {
          ...dto,
          modified_by: 1, // replace with logged-in user ID
          modified_at: new Date(),
        },
      });

      return {
        message: 'Hospital group updated successfully',
        data: updated,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Group name, code, or registration number already exists',
          );
        }
      }

      throw error;
    }
  }
}
