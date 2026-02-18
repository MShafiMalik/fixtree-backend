import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/auth/dto/responses';

export class AdminUserResponseDto extends UserResponseDto {
  @ApiProperty({ description: 'Is email verified', example: true })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Is phone verified', example: false })
  isPhoneVerified: boolean;

  @ApiProperty({ description: 'Is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Accepts marketing emails', example: false })
  acceptsMarketingEmails: boolean;

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
