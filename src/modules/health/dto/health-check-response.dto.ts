import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HealthInfoDto } from './health-info.dto';
import { HealthDetailsDto } from './health-details.dto';

export class HealthCheckResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ type: HealthInfoDto })
  info: HealthInfoDto;

  @ApiPropertyOptional({ type: Object })
  error?: Record<string, unknown>;

  @ApiProperty({ type: HealthDetailsDto })
  details: HealthDetailsDto;
}
