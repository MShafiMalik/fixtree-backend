import { VerifyEmailUserDto } from './verify-email-user.dto';

export class VerifyEmailResponseDto {
  message: string;
  user: VerifyEmailUserDto;
}
