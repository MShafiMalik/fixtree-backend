import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceInfoDto } from './device-info.dto';
import { AtLeastOne } from '../../../common/validators/at-least-one.validator';

export class LoginDto {
  @AtLeastOne(['email', 'phone'], {
    message: 'Either email or phone is required',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;
}
