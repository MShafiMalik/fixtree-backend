import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceInfoDto } from './device-info.dto';
import { AuthCredentialsBaseDto } from './auth-credentials-base.dto';

export class LoginDto extends AuthCredentialsBaseDto {
  @ApiPropertyOptional({ type: () => DeviceInfoDto })
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;
}
