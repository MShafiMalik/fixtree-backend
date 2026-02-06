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
import { SessionsService } from './sessions/sessions.service';
import { SendGridService } from '../../shared/sendgrid/sendgrid.service';
import { TwilioService } from '../../shared/twilio/twilio.service';
import { UploadService } from '../../shared/upload/upload.service';
import {
  GoogleLoginDto,
  RegisterDto,
  LoginDto,
  DeviceInfoDto,
  ResendEmailVerificationDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  ResendPhoneVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './dto/requests';
import {
  LoginResponseDto,
  RegisterResponseDto,
  MessageResponseDto,
  VerifyEmailResponseDto,
  UserResponseDto,
} from './dto/responses';

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
    private readonly uploadService: UploadService,
  ) {
    const googleClientIds =
      this.configService.get<string[]>('google.clientIds');
    const googleClientId = this.configService.get<string>('google.clientId');
    if (googleClientId || (googleClientIds?.length ?? 0) > 0) {
      this.googleClient = new OAuth2Client(
        googleClientId ?? googleClientIds?.[0],
      );
    }
  }

  async register(
    registerDto: RegisterDto,
    file?: Express.Multer.File,
  ): Promise<RegisterResponseDto> {
    if (registerDto.email && registerDto.phone) {
      throw new BadRequestException('Provide either email or phone, not both');
    }

    // Upload profile image to Cloudinary if file is provided
    if (file) {
      const uploadResult = await this.uploadService.uploadImage(
        file,
        'fixtree/profiles',
      );
      registerDto.profileImage = uploadResult.secureUrl;
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
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
      },
    } satisfies RegisterResponseDto;
  }

  async login(
    loginDto: LoginDto,
    context?: {
      deviceInfo?: DeviceInfoDto;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<LoginResponseDto> {
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
  ): Promise<LoginResponseDto> {
    const clientIds = this.configService.get<string[]>('google.clientIds');
    const clientId = this.configService.get<string>('google.clientId');
    const audiences = clientIds?.length
      ? clientIds
      : clientId
        ? [clientId]
        : [];
    if (!audiences.length || !this.googleClient) {
      throw new UnauthorizedException('Google login is not configured');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleLoginDto.idToken,
      audience: audiences,
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

  async refreshTokens(refreshToken: string): Promise<LoginResponseDto> {
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

  async logout(userId: string, sessionId: string): Promise<MessageResponseDto> {
    await this.sessionsService.revokeSession(sessionId, userId);
    return { message: 'Logged out successfully' };
  }

  async resendEmailVerification(
    dto: ResendEmailVerificationDto,
  ): Promise<MessageResponseDto> {
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

  async verifyEmail(dto: VerifyEmailDto): Promise<VerifyEmailResponseDto> {
    const user = await this.usersService.verifyEmail(dto.token);
    return {
      message: 'Email verified successfully.',
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async resendPhoneVerification(
    dto: ResendPhoneVerificationDto,
  ): Promise<MessageResponseDto> {
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

  async verifyPhone(dto: VerifyPhoneDto): Promise<MessageResponseDto> {
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

  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponseDto> {
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

  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponseDto> {
    await this.usersService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password reset successfully.' };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<MessageResponseDto> {
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

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    return this.toUserResponseDto(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    if (file) {
      const uploadResult = await this.uploadService.uploadImage(
        file,
        'fixtree/profiles',
      );
      dto.profileImage = uploadResult.secureUrl;
    }

    const user = await this.usersService.update(userId, dto);
    return this.toUserResponseDto(user);
  }

  private toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
    };
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
  ): LoginResponseDto {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
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
