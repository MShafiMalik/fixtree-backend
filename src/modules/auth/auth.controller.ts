import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import {
  UpdateProfileDto,
  RegisterDto,
  LoginDto,
  GoogleLoginDto,
  RefreshTokenDto,
  ResendEmailVerificationDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  ResendPhoneVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/requests';
import {
  LoginResponseDto,
  RegisterResponseDto,
  MessageResponseDto,
  VerifyEmailResponseDto,
  UserResponseDto,
} from './dto/responses';
import { imageUploadConfig } from '../../shared/upload/upload.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage', imageUploadConfig))
  register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto, file);
  }

  @Public()
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, {
      deviceInfo: loginDto.deviceInfo,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('google')
  googleLogin(
    @Body() googleLoginDto: GoogleLoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    return this.authService.googleLogin(googleLoginDto, {
      deviceInfo: googleLoginDto.deviceInfo,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('email/resend-verification')
  resendEmailVerification(
    @Body() dto: ResendEmailVerificationDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resendEmailVerification(dto);
  }

  @Public()
  @Post('email/verify')
  verifyEmail(@Body() dto: VerifyEmailDto): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('phone/resend-verification')
  resendPhoneVerification(
    @Body() dto: ResendPhoneVerificationDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resendPhoneVerification(dto);
  }

  @Public()
  @Post('phone/verify')
  verifyPhone(@Body() dto: VerifyPhoneDto): Promise<MessageResponseDto> {
    return this.authService.verifyPhone(dto);
  }

  @Post('password/change')
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.changePassword(user.sub, dto);
  }

  @Public()
  @Post('password/forgot')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponseDto> {
    return this.authService.resetPassword(dto);
  }

  @Post('logout')
  logout(@CurrentUser() user: JwtPayload): Promise<MessageResponseDto> {
    return this.authService.logout(user.sub, user.sessionId);
  }

  @Get('me')
  getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.authService.getMe(user.sub);
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('profileImage', imageUploadConfig))
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    return this.authService.updateProfile(user.sub, dto, file);
  }
}
