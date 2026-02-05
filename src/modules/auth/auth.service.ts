import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { UtilService } from '../../common/util/util.service';
import { APP_CONSTANTS } from '../../common/constants/app.constants';
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
import { SendGridService } from '../../shared/sendgrid/sendgrid.service';
import { TwilioService } from '../../shared/twilio/twilio.service';
import { ResendEmailVerificationDto } from './dto/resend-email-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { ResendPhoneVerificationDto } from './dto/resend-phone-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client | null = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly utilService: UtilService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionsService: SessionsService,
    private readonly sendGridService: SendGridService,
    private readonly twilioService: TwilioService,
  ) {
    const googleClientId = this.configService.get<string>('google.clientId');
    if (googleClientId) {
      this.googleClient = new OAuth2Client(googleClientId);
    }
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.email && registerDto.phone) {
      throw new BadRequestException('Provide either email or phone, not both');
    }

    const user = await this.usersService.create(registerDto);

    if (user.email) {
      this.assertVerificationCooldown(user.emailVerificationSentAt);
      const token = this.utilService.generateRandomString(48);
      const expiresAt = this.utilService.addMinutes(new Date(), 60);
      await this.usersService.setEmailVerificationToken(
        user.id,
        token,
        expiresAt,
      );

      await this.sendGridService.sendEmail({
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Your verification token is: <strong>${token}</strong></p>`,
      });
    }

    if (user.phone) {
      this.assertVerificationCooldown(user.phoneVerificationSentAt);
      await this.twilioService.sendVerificationCode(user.phone);
      await this.usersService.setPhoneVerificationSentAt(user.id);
    }

    return {
      message: `Registration successful. Please verify your ${user.email ? 'email' : 'phone'} to log in.`,
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
    if (!loginDto.email && !loginDto.phone) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const loginChannel = loginDto.email ? 'email' : 'phone';
    const user = loginDto.email
      ? await this.usersService.findByEmail(loginDto.email)
      : await this.usersService.findByPhone(loginDto.phone ?? '');

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

    if (loginChannel === 'email' && !user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before login');
    }

    if (loginChannel === 'phone' && !user.isPhoneVerified) {
      throw new UnauthorizedException('Please verify your phone before login');
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

  async resendEmailVerification(dto: ResendEmailVerificationDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { message: 'This email is not registered.' };
    }

    if (user.isEmailVerified) {
      return { message: 'Email already verified.' };
    }

    this.assertVerificationCooldown(user.emailVerificationSentAt);
    const token = this.utilService.generateRandomString(48);
    const expiresAt = this.utilService.addMinutes(new Date(), 60);
    await this.usersService.setEmailVerificationToken(
      user.id,
      token,
      expiresAt,
    );

    const email = user.email ?? dto.email;
    await this.sendGridService.sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Your verification token is: <strong>${token}</strong></p>`,
    });

    return { message: 'Verification email sent.' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.usersService.verifyEmail(dto.token);
    return {
      message: 'Email verified successfully.',
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async resendPhoneVerification(dto: ResendPhoneVerificationDto) {
    const user = await this.usersService.findByPhone(dto.phone);
    if (!user) {
      return { message: 'This phone number is not registered.' };
    }

    if (user.isPhoneVerified) {
      return { message: 'Phone already verified.' };
    }

    this.assertVerificationCooldown(user.phoneVerificationSentAt);
    await this.twilioService.sendVerificationCode(dto.phone);
    await this.usersService.setPhoneVerificationSentAt(user.id);
    return { message: 'Verification code sent.' };
  }

  async verifyPhone(dto: VerifyPhoneDto) {
    const user = await this.usersService.findByPhone(dto.phone);
    if (!user) {
      throw new UnauthorizedException('Invalid phone verification request');
    }

    const isValid = await this.twilioService.verifyCode(dto.phone, dto.code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid verification code');
    }

    await this.usersService.setPhoneVerified(user.id, dto.phone);
    return { message: 'Phone verified successfully.' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { message: 'This email is not registered.' };
    }

    const token = this.utilService.generateRandomString(48);
    const expiresAt = this.utilService.addMinutes(new Date(), 60);
    await this.usersService.setPasswordResetToken(user.id, token, expiresAt);

    const email = user.email ?? dto.email;
    await this.sendGridService.sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Your password reset token is: <strong>${token}</strong></p>`,
    });

    return { message: 'Password reset instructions sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    await this.usersService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password reset successfully.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user.password) {
      throw new UnauthorizedException('Password authentication not available');
    }

    const isValid = await this.utilService.comparePasswords(
      dto.currentPassword,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.usersService.updatePassword(userId, dto.newPassword);
    return { message: 'Password changed successfully.' };
  }

  async getMe(userId: string) {
    return this.usersService.findById(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.usersService.update(userId, dto);
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

  private assertVerificationCooldown(sentAt: Date | null) {
    if (!sentAt) {
      return;
    }

    const nextAllowedAt = this.utilService.addMinutes(
      sentAt,
      APP_CONSTANTS.VERIFICATION_COOLDOWN_MINUTES,
    );
    if (nextAllowedAt > new Date()) {
      const cooldownMinutes = String(
        APP_CONSTANTS.VERIFICATION_COOLDOWN_MINUTES,
      );
      throw new ConflictException(
        `Please wait ${cooldownMinutes} minute before requesting another verification token`,
      );
    }
  }
}
