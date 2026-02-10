import { ApiProperty } from '@nestjs/swagger';
import { VerifyEmailUserDto } from './verify-email-user.dto';

export class VerifyEmailResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: VerifyEmailUserDto })
  user: VerifyEmailUserDto;
}
