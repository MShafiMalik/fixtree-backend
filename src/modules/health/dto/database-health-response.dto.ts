import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DatabaseHealthInfoDto } from './database-health-info.dto';
import { DatabaseHealthDetailsDto } from './database-health-details.dto';

export class DatabaseHealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ type: DatabaseHealthInfoDto })
  info: DatabaseHealthInfoDto;

  @ApiPropertyOptional({ type: Object })
  error?: Record<string, unknown>;

  @ApiProperty({ type: DatabaseHealthDetailsDto })
  details: DatabaseHealthDetailsDto;
}
