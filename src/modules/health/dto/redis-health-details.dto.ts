import { ApiProperty } from '@nestjs/swagger';
import { HealthStatusDto } from './health-status.dto';

export class RedisHealthDetailsDto {
  @ApiProperty({ type: HealthStatusDto })
  redis: HealthStatusDto;
}
