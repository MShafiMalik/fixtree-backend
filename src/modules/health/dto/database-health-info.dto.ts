import { ApiProperty } from '@nestjs/swagger';
import { HealthStatusDto } from './health-status.dto';

export class DatabaseHealthInfoDto {
  @ApiProperty({ type: HealthStatusDto })
  database: HealthStatusDto;
}
