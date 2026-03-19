import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    // 🔍 Check if email already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Create user
    const user = await this.prisma.users.create({
      data: {
        ...rest,
        password_hash: hashedPassword,
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role_id: true,
        profile_image_url: true,
        created_at: true,
      },
    });

    return user;
  }

  //include role also
  async findAll() {
    return await this.prisma.users.findMany({
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role_id: true,
        profile_image_url: true,
        refresh_token: true,
        created_at: true,
        roles: {
          select: {
            role_name: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmailorPhone(email: string, phone_number: string) {
    return this.prisma.users.findFirst({
      where: {
        OR: [{ email: email }, { phone_number: phone_number }],
      },
    });
  }

  findById(id: number) {
    return this.prisma.users.findUnique({
      where: { user_id: id },
      include: {
        roles: true,
      },
    });
  }

  findByIdWithRelations(id: number) {
    return this.prisma.users.findUnique({
      where: { user_id: id },
      include: {
        roles: true,
        employees_employees_user_idTousers: true,
        doctors_doctors_user_idTousers: true,
        patients_patients_user_idTousers: true,
      },
    });
  }

  updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    expiresAt: Date | null,
  ) {
    return this.prisma.users.update({
      where: { user_id: Number(userId) },
      data: {
        refresh_token: refreshToken,
        refresh_token_expires_at: expiresAt,
      },
    });
  }
}
