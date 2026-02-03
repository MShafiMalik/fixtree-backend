import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Platform } from '../../../common/enums/platform.enum';

export class DeviceInfoDto {
  @IsEnum(Platform)
  @IsOptional()
  platform?: Platform;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  deviceName?: string;

  @IsString()
  @IsOptional()
  appVersion?: string;

  @IsString()
  @IsOptional()
  osVersion?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;
}
