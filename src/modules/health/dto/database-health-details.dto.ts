import { ApiProperty } from '@nestjs/swagger';
import { HealthStatusDto } from './health-status.dto';

export class DatabaseHealthDetailsDto {
  @ApiProperty({ type: HealthStatusDto })
  database: HealthStatusDto;
}
