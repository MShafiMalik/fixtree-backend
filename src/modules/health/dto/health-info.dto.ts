import { ApiProperty } from '@nestjs/swagger';
import { HealthStatusDto } from './health-status.dto';

export class HealthInfoDto {
  @ApiProperty({ type: HealthStatusDto })
  database: HealthStatusDto;

  @ApiProperty({ type: HealthStatusDto })
  redis: HealthStatusDto;

  @ApiProperty({ type: HealthStatusDto })
  memory_heap: HealthStatusDto;

  @ApiProperty({ type: HealthStatusDto })
  memory_rss: HealthStatusDto;

  @ApiProperty({ type: HealthStatusDto })
  disk: HealthStatusDto;
}
