import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceInfoDto } from './device-info.dto';
import { AtLeastOne } from '../../../../common/validators/at-least-one.validator';

export class LoginDto {
  @ApiPropertyOptional({ format: 'email', example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ minLength: 8, example: 'Pass@1234' })
  @AtLeastOne(['email', 'phone'], {
    message: 'Either email or phone is required',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ type: () => DeviceInfoDto })
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;
}
