import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { AdminAuthService } from './admin-auth.service';
import { SessionsService } from '../../auth/sessions/sessions.service';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/enums/role.enum';
import type { JwtPayload } from '../../../common/types/jwt-payload.type';
import {
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
  RefreshTokenDto,
} from '../../auth/dto/requests';
import {
  LoginResponseDto,
  MessageResponseDto,
  UserResponseDto,
} from '../../auth/dto/responses';
import { SessionResponseDto } from '../../auth/sessions/dto/responses/session-response.dto';
import { imageUploadConfig } from '../../../shared/upload/upload.config';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Public()
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    return this.adminAuthService.login(loginDto, {
      deviceInfo: loginDto.deviceInfo,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.adminAuthService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('logout')
  logout(@CurrentUser() user: JwtPayload): Promise<MessageResponseDto> {
    return this.adminAuthService.logout(user.sub, user.sessionId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('password/change')
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<MessageResponseDto> {
    return this.adminAuthService.changePassword(user.sub, dto);
  }

  @Public()
  @Post('password/forgot')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    return this.adminAuthService.forgotPassword(dto);
  }

  @Public()
  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponseDto> {
    return this.adminAuthService.resetPassword(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('me')
  getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.adminAuthService.getMe(user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('profileImage', imageUploadConfig))
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    return this.adminAuthService.updateProfile(user.sub, dto, file);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('sessions')
  async listSessions(
    @CurrentUser() user: JwtPayload,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.getSessions(user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('sessions/:id')
  async revokeSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeSession(id, user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('sessions')
  async revokeAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeAll(user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('sessions/others')
  async revokeOthers(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeOthers(user.sub, user.sessionId);
  }
}
