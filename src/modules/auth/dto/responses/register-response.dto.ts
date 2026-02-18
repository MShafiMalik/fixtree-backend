import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class RegisterResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({
    description: 'Whether email or phone verification is required',
  })
  verificationRequired: boolean;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
