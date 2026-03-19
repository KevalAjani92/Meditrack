import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { GetDoctorsQueryDto } from './dto/get-doctors-query.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsAdminService {
  constructor(private prisma: PrismaService) {}

  // ─── GET ALL DOCTORS (Paginated + Search + Filter + Stats) ─────
  async getAllDoctors(hospitalId: number, query: GetDoctorsQueryDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '8');
    const skip = (page - 1) * limit;

    const where: any = {
      hospital_id: hospitalId,
    };

    // 🔍 Search by name or specialization
    if (query.search) {
      where.OR = [
        {
          users_doctors_user_idTousers: {
            full_name: { contains: query.search, mode: 'insensitive' },
          },
        },
        {
          specializations: {
            specialization_name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
        {
          medical_license_no: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 🔎 Filter by department
    if (query.department_id) {
      where.department_id = parseInt(query.department_id);
    }

    // 🔎 Filter by status
    if (query.status) {
      where.is_active = query.status === 'Active';
    }

    const includeRelations = {
      users_doctors_user_idTousers: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
          phone_number: true,
          profile_image_url: true,
          is_active: true,
          last_login_at: true,
        },
      },
      departments_master: {
        select: {
          department_id: true,
          department_name: true,
        },
      },
      specializations: {
        select: {
          specialization_id: true,
          specialization_name: true,
        },
      },
    };

    const [doctors, filteredCount, availableCount, departmentCount] =
      await this.prisma.$transaction([
        this.prisma.doctors.findMany({
          where,
          skip,
          take: limit,
          include: includeRelations,
          orderBy: { created_at: 'desc' },
        }),

        this.prisma.doctors.count({ where }),

        // Available doctors (active + available)
        this.prisma.doctors.count({
          where: {
            hospital_id: hospitalId,
            is_active: true,
            is_available: true,
          },
        }),

        // Unique departments covered
        this.prisma.doctors.findMany({
          where: { hospital_id: hospitalId, is_active: true },
          select: { department_id: true },
          distinct: ['department_id'],
        }),
      ]);

    const totalDoctors = await this.prisma.doctors.count({
      where: { hospital_id: hospitalId },
    });

    return {
      data: {
        data: doctors.map((d) => ({
          doctor_id: d.doctor_id,
          user_id: d.user_id,
          doctor_name: d.users_doctors_user_idTousers.full_name,
          email: d.users_doctors_user_idTousers.email,
          phone_number: d.users_doctors_user_idTousers.phone_number,
          profile_image_url: d.users_doctors_user_idTousers.profile_image_url,
          department_id: d.department_id,
          department_name: d.departments_master.department_name,
          specialization_id: d.specialization_id,
          specialization: d.specializations.specialization_name,
          gender: d.gender,
          qualification: d.qualification,
          experience_years: d.experience_years,
          consultation_fees: Number(d.consultation_fees),
          medical_license_no: d.medical_license_no,
          availability: d.is_available ? 'Available' : 'Unavailable',
          status: d.is_active ? 'Active' : 'Inactive',
          description: d.description,
          joined_date: d.created_at,
          avatar_initials: d.users_doctors_user_idTousers.full_name
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
          totalDoctors,
          availableDoctors: availableCount,
          unavailableDoctors: totalDoctors - availableCount,
          departmentsCovered: departmentCount.length,
        },
      },
    };
  }

  // ─── CREATE DOCTOR ─────────────────────────────────────────────
  async createDoctor(
    hospitalId: number,
    dto: CreateDoctorDto,
    createdBy: number,
  ) {
    // Get Doctor role
    const role = await this.prisma.roles.findUnique({
      where: { role_name: 'Doctor' },
    });

    if (!role) {
      throw new BadRequestException('Doctor role not found in system');
    }

    // Validate department exists for this hospital
    const deptExists = await this.prisma.hospital_departments.findFirst({
      where: {
        hospital_id: hospitalId,
        department_id: dto.department_id,
        is_active: true,
      },
    });

    if (!deptExists) {
      throw new BadRequestException(
        'Department is not enabled for this hospital',
      );
    }

    // Validate specialization exists
    const specExists = await this.prisma.specializations.findUnique({
      where: { specialization_id: dto.specialization_id },
    });

    if (!specExists) {
      throw new BadRequestException('Specialization not found');
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

    // Check unique license
    const licenseExists = await this.prisma.doctors.findUnique({
      where: { medical_license_no: dto.medical_license_no },
    });

    if (licenseExists) {
      throw new BadRequestException(
        'Medical license number is already registered',
      );
    }

    const creatorExists = await this.prisma.users.findUnique({
      where: { user_id: createdBy },
    });

    if (!creatorExists) {
      throw new BadRequestException('Invalid creator user');
    }

    // Generate password
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
          is_active: dto.is_active ?? true,
        },
      });

      // 2️⃣ Create Doctor record
      const doctor = await tx.doctors.create({
        data: {
          user_id: user.user_id,
          hospital_id: hospitalId,
          department_id: dto.department_id,
          specialization_id: dto.specialization_id,
          gender: dto.gender,
          qualification: dto.qualification,
          medical_license_no: dto.medical_license_no,
          experience_years: dto.experience_years,
          consultation_fees: dto.consultation_fees,
          is_active: dto.is_active ?? true,
          is_available: dto.is_available ?? true,
          description: dto.description || null,
          created_by: createdBy,
          modified_by: createdBy,
        },
      });

      return {
        message: 'Doctor created successfully',
        data: {
          generatedPassword: plainPassword,
          user_id: user.user_id,
          doctor_id: doctor.doctor_id,
        },
      };
    });
  }

  // ─── UPDATE DOCTOR ─────────────────────────────────────────────
  async updateDoctor(
    doctorId: number,
    dto: UpdateDoctorDto,
    modifiedBy: number,
  ) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { doctor_id: doctorId },
      include: { users_doctors_user_idTousers: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Validate unique email if changing
    if (dto.email && dto.email !== doctor.users_doctors_user_idTousers.email) {
      const emailExists = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new BadRequestException('Email is already registered');
      }
    }

    // Validate unique phone if changing
    if (
      dto.phone_number &&
      dto.phone_number !== doctor.users_doctors_user_idTousers.phone_number
    ) {
      const phoneExists = await this.prisma.users.findUnique({
        where: { phone_number: dto.phone_number },
      });
      if (phoneExists) {
        throw new BadRequestException('Phone number is already registered');
      }
    }

    // Validate unique license if changing
    if (
      dto.medical_license_no &&
      dto.medical_license_no !== doctor.medical_license_no
    ) {
      const licenseExists = await this.prisma.doctors.findUnique({
        where: { medical_license_no: dto.medical_license_no },
      });
      if (licenseExists) {
        throw new BadRequestException(
          'Medical license number is already registered',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Update User record
      await tx.users.update({
        where: { user_id: doctor.user_id },
        data: {
          ...(dto.full_name && { full_name: dto.full_name }),
          ...(dto.email && { email: dto.email }),
          ...(dto.phone_number && { phone_number: dto.phone_number }),
          ...(dto.is_active !== undefined && { is_active: dto.is_active }),
        },
      });

      // 2️⃣ Update Doctor record
      await tx.doctors.update({
        where: { doctor_id: doctorId },
        data: {
          ...(dto.department_id && { department_id: dto.department_id }),
          ...(dto.specialization_id && {
            specialization_id: dto.specialization_id,
          }),
          ...(dto.gender && { gender: dto.gender }),
          ...(dto.qualification && { qualification: dto.qualification }),
          ...(dto.experience_years !== undefined && {
            experience_years: dto.experience_years,
          }),
          ...(dto.consultation_fees !== undefined && {
            consultation_fees: dto.consultation_fees,
          }),
          ...(dto.medical_license_no && {
            medical_license_no: dto.medical_license_no,
          }),
          ...(dto.is_available !== undefined && {
            is_available: dto.is_available,
          }),
          ...(dto.is_active !== undefined && { is_active: dto.is_active }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          modified_by: modifiedBy,
        },
      });

      return { message: 'Doctor updated successfully' };
    });
  }

  // ─── TOGGLE STATUS ─────────────────────────────────────────────
  async toggleDoctorStatus(doctorId: number) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { doctor_id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { user_id: doctor.user_id },
        data: { is_active: !doctor.is_active },
      });

      await tx.doctors.update({
        where: { doctor_id: doctorId },
        data: { is_active: !doctor.is_active },
      });

      return {
        message: `Doctor ${!doctor.is_active ? 'activated' : 'deactivated'} successfully`,
      };
    });
  }

  // ─── RESET PASSWORD ────────────────────────────────────────────
  async resetDoctorPassword(doctorId: number) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { doctor_id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const plainPassword = randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await this.prisma.users.update({
      where: { user_id: doctor.user_id },
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

  // ─── GET SPECIALIZATIONS DROPDOWN ──────────────────────────────
  async getSpecializations() {
    const specializations = await this.prisma.specializations.findMany({
      where: { is_active: true },
      select: {
        specialization_id: true,
        specialization_name: true,
      },
      orderBy: { specialization_name: 'asc' },
    });

    return { data: specializations };
  }

  // ─── GET DEPARTMENT DROPDOWN (hospital-specific) ───────────────
  async getDepartmentDropdown(hospitalId: number) {
    const departments = await this.prisma.hospital_departments.findMany({
      where: {
        hospital_id: hospitalId,
        is_active: true,
      },
      include: {
        departments_master: {
          select: {
            department_id: true,
            department_name: true,
          },
        },
      },
      orderBy: {
        departments_master: {
          department_name: 'asc',
        },
      },
    });

    return {
      data: departments.map((d) => ({
        department_id: d.departments_master.department_id,
        department_name: d.departments_master.department_name,
      })),
    };
  }
}
