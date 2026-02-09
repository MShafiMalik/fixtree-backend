import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { UtilService } from '../../../common/util/util.service';
import { Role } from '../../../common/enums/role.enum';
import {
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from '../../auth/dto/requests';
import {
  LoginResponseDto,
  MessageResponseDto,
  UserResponseDto,
} from '../../auth/dto/responses';
import { DeviceInfoDto } from '../../auth/dto/requests';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
  ) {}

  async login(
    loginDto: LoginDto,
    context?: {
      deviceInfo?: DeviceInfoDto;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<LoginResponseDto> {
    const user = loginDto.email
      ? await this.usersService.findByEmail(loginDto.email)
      : await this.usersService.findByPhone(loginDto.phone ?? '');

    if (!user?.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new UnauthorizedException('Access denied. Admin access required.');
    }

    const isPasswordValid = await this.utilService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.performLogin(user, context);
  }

  async refreshTokens(refreshToken: string): Promise<LoginResponseDto> {
    const result = await this.authService.refreshTokens(refreshToken);

    const user = await this.usersService.findById(result.user.id);
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new UnauthorizedException('Access denied. Admin access required.');
    }

    return result;
  }

  async logout(userId: string, sessionId: string): Promise<MessageResponseDto> {
    return this.authService.logout(userId, sessionId);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.changePassword(userId, dto);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('This email is not registered.');
    }

    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new UnauthorizedException('This email is not registered.');
    }

    return this.authService.forgotPassword(dto);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponseDto> {
    return this.authService.resetPassword(dto);
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    return this.authService.getMe(userId);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    return this.authService.updateProfile(userId, dto, file);
  }
}
