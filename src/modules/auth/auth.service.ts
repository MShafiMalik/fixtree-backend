import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { UtilService } from '../../common/util/util.service';
import {
  JwtPayload,
  JwtRefreshPayload,
} from '../../common/types/jwt-payload.type';
import { User } from '../users/entities/user.entity';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SessionsService } from './sessions/sessions.service';
import { DeviceInfoDto } from './dto/device-info.dto';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client | null = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly utilService: UtilService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionsService: SessionsService,
  ) {
    const googleClientId = this.configService.get<string>('google.clientId');
    if (googleClientId) {
      this.googleClient = new OAuth2Client(googleClientId);
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return {
      message:
        'Registration successful. Please verify your email or phone to log in.',
      verificationRequired: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(
    loginDto: LoginDto,
    context?: {
      deviceInfo?: DeviceInfoDto;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user?.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.utilService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified && !user.isPhoneVerified) {
      throw new UnauthorizedException(
        'Please verify your email or phone number before login',
      );
    }

    const session = await this.sessionsService.createSession(
      user.id,
      context?.deviceInfo,
      context?.ipAddress,
      context?.userAgent,
    );
    const tokens = await this.signTokens(user, session.id);

    return this.buildAuthResponse(user, tokens);
  }

  async googleLogin(
    googleLoginDto: GoogleLoginDto,
    context?: {
      deviceInfo?: DeviceInfoDto;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    const clientId = this.configService.get<string>('google.clientId');
    if (!clientId || !this.googleClient) {
      throw new UnauthorizedException('Google login is not configured');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleLoginDto.idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const user = await this.usersService.findOrCreateByGoogle({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email,
      profileImage: payload.picture,
    });

    const session = await this.sessionsService.createSession(
      user.id,
      context?.deviceInfo,
      context?.ipAddress,
      context?.userAgent,
    );
    const tokens = await this.signTokens(user, session.id);

    return this.buildAuthResponse(user, tokens);
  }

  async refreshTokens(refreshToken: string) {
    const refreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');

    try {
      const payload = await this.jwtService.verifyAsync<JwtRefreshPayload>(
        refreshToken,
        {
          secret: refreshSecret,
        },
      );

      const user = await this.usersService.findById(payload.sub);
      await this.sessionsService.validateSession(payload.sessionId);
      await this.sessionsService.touch(payload.sessionId);
      const tokens = await this.signTokens(user, payload.sessionId);

      return this.buildAuthResponse(user, tokens);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, sessionId: string) {
    await this.sessionsService.revokeSession(sessionId, userId);
    return { message: 'Logged out successfully' };
  }

  private async signTokens(user: User, sessionId: string) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };

    const secret = this.configService.getOrThrow<string>('jwt.refreshSecret');
    const expiresIn = (this.configService.get<string>('jwt.refreshExpiresIn') ??
      '7d') as StringValue;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        { sub: user.id, sessionId } as JwtRefreshPayload,
        { secret, expiresIn },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private buildAuthResponse(
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
