import { ApiProperty } from '@nestjs/swagger';
import { Platform } from '../../../../../common/enums/platform.enum';

export class SessionResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ enum: Platform, nullable: true, example: Platform.WEB })
  platform: Platform | null;

  @ApiProperty({ nullable: true, example: 'device-12345-abcde' })
  deviceId: string | null;

  @ApiProperty({ nullable: true, example: 'MacBook Pro' })
  deviceName: string | null;

  @ApiProperty({ nullable: true, example: '1.0.0' })
  appVersion: string | null;

  @ApiProperty({ nullable: true, example: 'macOS 14.0' })
  osVersion: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko)',
  })
  userAgent: string | null;

  @ApiProperty({ nullable: true, example: '192.168.1.1' })
  ipAddress: string | null;

  @ApiProperty({ nullable: true, example: '2024-01-15T10:30:00Z' })
  lastUsedAt: Date | null;

  @ApiProperty({ example: '2024-01-10T08:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: false })
  isRevoked: boolean;
}
