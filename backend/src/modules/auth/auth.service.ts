import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma, users } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthUser } from './interfaces/auth-user.interface';
import { CounterService } from 'src/common/services/counter/counter.service';

export interface JwtPayload {
  sub: string; // user_id
  role: string; // SuperAdmin | GroupAdmin | HospitalAdmin | Receptionist | Doctor | Patient
  group_id?: number; // present for group-level users
  hospital_id?: number; // present for hospital-level users
}

export interface Tokens {
  accessToken: string;
  // refreshToken: string;
}

interface AuthResult {
  tokens: Tokens;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly counterService: CounterService,
  ) {}

  /* ========================= REGISTER ========================= */

  async register(dto: RegisterDto): Promise<AuthResult> {
    // 1️⃣ Check existing user
    const existingUser = await this.usersService.findByEmailorPhone(
      dto.email,
      dto.phone_number,
    );

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prismaService.$transaction(async (tx) => {
      // 3️⃣ Get Patient Role
      const role = await tx.roles.findUnique({
        where: { role_name: 'Patient' },
      });

      if (!role) {
        throw new Error('Patient role not found');
      }

      // 4️⃣ Create User
      const user = await tx.users.create({
        data: {
          full_name: dto.full_name,
          email: dto.email,
          phone_number: dto.phone_number,
          password_hash: hashedPassword,
          role_id: role.role_id,
        },
      });

      // 5️⃣ Generate Patient Number
      const patientNo = await this.counterService.generatePatientNumber(
        tx,
        dto.hospital_group_id,
        1,
      );

      // 6️⃣ Create Patient
      const patient = await tx.patients.create({
        data: {
          user_id: user.user_id,
          hospital_group_id: dto.hospital_group_id,
          patient_no: patientNo,
          full_name: dto.full_name,
          gender: dto.gender,
          dob: new Date(dto.dob),
          is_profile_completed: false,
        },
      });

      // 7️⃣ Create Contact Details
      await tx.patient_contact_details.create({
        data: {
          patient_id: patient.patient_id,
          phone_number: dto.phone_number,
          email: dto.email,
        },
      });

      return { user, patient };
    });

    // 8️⃣ Generate Tokens
    const tokens = await this.generateTokens(result.user);

    // 9️⃣ Store Refresh Token
    // await this.storeRefreshToken(
    //   result.user.user_id.toString(),
    //   tokens.refreshToken,
    // );

    const userPayload = await this.buildUserPayload(result.user);

    return {
      tokens,
      user: userPayload,
    };
  }

  /* ========================= LOGIN ========================= */

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.validateUser(dto.credential, dto.password);

    const scope = await this.getUserScope(user);

    const tokens = await this.generateTokens(
      user,
      scope.hospital_id,
      scope.group_id,
    );

    // await this.storeRefreshToken(user.user_id.toString(), tokens.refreshToken);

    const userPayload = await this.buildUserPayload(user);

    return {
      tokens,
      user: userPayload,
    };
  }

  /* ========================= VALIDATE USER ========================= */

  private async validateUser(
    credential: string,
    password: string,
  ): Promise<users> {
    const user = await this.prismaService.users.findFirst({
      where: {
        OR: [{ email: credential }, { phone_number: credential }],
      },
      include: {
        roles: true,
      },
    });
    if (!user) throw new ConflictException('Invalid Credential');

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /* ========================= REFRESH ========================= */

  // async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
  //   const user = await this.usersService.findById(Number(userId));

  //   if (!user || !user.refresh_token) {
  //     throw new ForbiddenException('Access denied');
  //   }

  //   if (
  //     user.refresh_token_expires_at &&
  //     user.refresh_token_expires_at < new Date()
  //   ) {
  //     throw new ForbiddenException('Refresh token expired');
  //   }

  //   const refreshMatch = await bcrypt.compare(refreshToken, user.refresh_token);

  //   if (!refreshMatch) {
  //     throw new ForbiddenException('Access denied');
  //   }

  //   const tokens = await this.generateTokens(user);
  //   await this.storeRefreshToken(user.user_id.toString(), tokens.refreshToken);

  //   return tokens;
  // }

  /* ========================= LOGOUT ========================= */

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null, null);
  }

  /* ========================= TOKEN HELPERS ========================= */

  private async generateTokens(
    user: users,
    hospital_id?: number,
    hospital_group_id?: number,
  ): Promise<Tokens> {
    const role = await this.prismaService.roles.findUnique({
      where: { role_id: user.role_id },
    });

    if (!role) {
      throw new Error('Role not found');
    }
    const payload: JwtPayload = {
      sub: user.user_id.toString(),
      role: role.role_name,
      hospital_id,
      group_id: hospital_group_id,
    };

    // const [accessToken, refreshToken] = await Promise.all([
    //   this.jwtService.signAsync(payload, {
    //     secret: process.env.JWT_SECRET,
    //     expiresIn: '7d',
    //   }),
    //   this.jwtService.signAsync(
    //     { ...payload, type: 'refresh' },
    //     {
    //       secret: process.env.JWT_REFRESH_SECRET,
    //       expiresIn: '7d',
    //     },
    //   ),
    // ]);

    // return { accessToken, refreshToken };

    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    // expiry = 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.usersService.updateRefreshToken(userId, hashedToken, expiresAt);
  }

  /* ========================= User Scope Helper ========================= */

  private async getUserScope(user: users): Promise<{
    group_id?: number;
    hospital_id?: number;
  }> {
    const role = await this.prismaService.roles.findUnique({
      where: { role_id: user.role_id },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    switch (role.role_name) {
      case 'SuperAdmin':
        return {};

      case 'GroupAdmin': {
        const employee = await this.prismaService.employees.findUnique({
          where: { user_id: user.user_id },
        });

        return {
          group_id: employee?.hospital_group_id ?? undefined,
        };
      }

      case 'HospitalAdmin':
      case 'Receptionist': {
        const employee = await this.prismaService.employees.findUnique({
          where: { user_id: user.user_id },
        });

        return {
          group_id: employee?.hospital_group_id ?? undefined,
          hospital_id: employee?.hospital_id ?? undefined,
        };
      }

      case 'Doctor': {
        const doctor = await this.prismaService.doctors.findUnique({
          where: { user_id: user.user_id },
        });

        return {
          hospital_id: doctor?.hospital_id ?? undefined,
        };
      }

      case 'Patient': {
        const patient = await this.prismaService.patients.findUnique({
          where: { user_id: user.user_id },
        });

        return {
          group_id: patient?.hospital_group_id ?? undefined,
        };
      }

      default:
        return {};
    }
  }

  public async buildUserPayload(user: users): Promise<AuthUser> {
    const role = await this.prismaService.roles.findUnique({
      where: { role_id: user.role_id },
    });

    const scope = await this.getUserScope(user);

    return {
      id: user.user_id.toString(),
      name: user.full_name,
      email: user.email,
      role: role?.role_name ?? 'Unknown',
      profileImageUrl: user.profile_image_url ?? null,
      hospitalgroupid: scope.group_id ?? null,
      hospitalid: scope.hospital_id ?? null,
    };
  }
}
