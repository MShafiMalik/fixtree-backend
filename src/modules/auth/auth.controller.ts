import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { ResendEmailVerificationDto } from './dto/resend-email-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { ResendPhoneVerificationDto } from './dto/resend-phone-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.authService.login(loginDto, {
      deviceInfo: loginDto.deviceInfo,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('google')
  googleLogin(@Body() googleLoginDto: GoogleLoginDto, @Req() req: Request) {
    return this.authService.googleLogin(googleLoginDto, {
      deviceInfo: googleLoginDto.deviceInfo,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('resend-email-verification')
  resendEmailVerification(@Body() dto: ResendEmailVerificationDto) {
    return this.authService.resendEmailVerification(dto);
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('resend-phone-verification')
  resendPhoneVerification(@Body() dto: ResendPhoneVerificationDto) {
    return this.authService.resendPhoneVerification(dto);
  }

  @Public()
  @Post('verify-phone')
  verifyPhone(@Body() dto: VerifyPhoneDto) {
    return this.authService.verifyPhone(dto);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user.sub, user.sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getMe(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.sub, dto);
  }
}
