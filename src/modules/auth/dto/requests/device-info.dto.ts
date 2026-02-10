import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Platform } from '../../../../common/enums/platform.enum';

export class DeviceInfoDto {
  @ApiPropertyOptional({ enum: Platform, example: Platform.WEB })
  @IsEnum(Platform)
  @IsOptional()
  platform?: Platform;

  @ApiPropertyOptional({ example: 'device-12345-abcde' })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({ example: 'MacBook Pro' })
  @IsString()
  @IsOptional()
  deviceName?: string;

  @ApiPropertyOptional({ example: '1.0.0' })
  @IsString()
  @IsOptional()
  appVersion?: string;

  @ApiPropertyOptional({ example: 'macOS 14.0' })
  @IsString()
  @IsOptional()
  osVersion?: string;

  @ApiPropertyOptional({
    example:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko)',
  })
  @IsString()
  @IsOptional()
  userAgent?: string;
}
