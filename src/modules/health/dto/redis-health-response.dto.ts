import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RedisHealthInfoDto } from './redis-health-info.dto';
import { RedisHealthDetailsDto } from './redis-health-details.dto';

export class RedisHealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ type: RedisHealthInfoDto })
  info: RedisHealthInfoDto;

  @ApiPropertyOptional({ type: Object })
  error?: Record<string, unknown>;

  @ApiProperty({ type: RedisHealthDetailsDto })
  details: RedisHealthDetailsDto;
}
