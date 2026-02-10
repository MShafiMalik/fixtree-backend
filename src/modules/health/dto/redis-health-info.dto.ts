import { ApiProperty } from '@nestjs/swagger';
import { HealthStatusDto } from './health-status.dto';

export class RedisHealthInfoDto {
  @ApiProperty({ type: HealthStatusDto })
  redis: HealthStatusDto;
}
