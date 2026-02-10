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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
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

@ApiTags('admin')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Admin login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Access denied - not an admin' })
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
  @ApiOperation({ summary: 'Refresh admin access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.adminAuthService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin logout' })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@CurrentUser() user: JwtPayload): Promise<MessageResponseDto> {
    return this.adminAuthService.logout(user.sub, user.sessionId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('password/change')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change admin password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<MessageResponseDto> {
    return this.adminAuthService.changePassword(user.sub, dto);
  }

  @Public()
  @Post('password/forgot')
  @ApiOperation({ summary: 'Request admin password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    return this.adminAuthService.forgotPassword(dto);
  }

  @Public()
  @Post('password/reset')
  @ApiOperation({ summary: 'Reset admin password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponseDto> {
    return this.adminAuthService.resetPassword(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({
    status: 200,
    description: 'Admin profile retrieved',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.adminAuthService.getMe(user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('profileImage', imageUploadConfig))
  @ApiOperation({ summary: 'Update admin profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    return this.adminAuthService.updateProfile(user.sub, dto, file);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('sessions')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List admin sessions' })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved',
    type: [SessionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listSessions(
    @CurrentUser() user: JwtPayload,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.getSessions(user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('sessions/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke a specific admin session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session revoked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async revokeSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeSession(id, user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('sessions')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke all admin sessions' })
  @ApiResponse({
    status: 200,
    description: 'All sessions revoked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async revokeAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeAll(user.sub);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('sessions/others')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke all other admin sessions (except current)' })
  @ApiResponse({
    status: 200,
    description: 'Other sessions revoked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async revokeOthers(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeOthers(user.sub, user.sessionId);
  }
}
