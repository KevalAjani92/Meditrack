import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService, Tokens } from './auth.service';
// import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /* ========================= REGISTER ========================= */

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);

    this.setCookies(res, result.tokens);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
      },
    };
  }

  /* ========================= LOGIN ========================= */

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    this.setCookies(res, result.tokens);

    return {
      success: true,
      message: 'Logged in successfully',
      data: {
        user: result.user,
      },
    };
  }

  /* ========================= ME ========================= */

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const user = await this.usersService.findById(Number(req.user.sub));

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const payload = await this.authService.buildUserPayload(user);

    return {
      success: true,
      data: {
        user: payload,
      },
    };
  }

  /* ========================= REFRESH ========================= */

  // @UseGuards(JwtRefreshGuard)
  // @Post('refresh')
  // async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
  //   const tokens = await this.authService.refreshTokens(
  //     req.user.sub,
  //     req.user.refreshToken,
  //   );

  //   this.setCookies(res, tokens);

  //   return { message: 'Token refreshed' };
  // }

  /* ========================= LOGOUT ========================= */

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.sub);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
    };

    // ✅ Apply identical options to successfully clear
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);

    return { success: true, message: 'Logged out successfully' };
  }

  /* ========================= COOKIE HELPER ========================= */

  private setCookies(res: Response, tokens: Tokens) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // res.cookie('refresh_token', tokens.refreshToken, {
    //   httpOnly: true,
    //   secure: isProduction,
    //   sameSite: 'lax',
    //   // path: '/auth/refresh', // restrict usage
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
  }
}
