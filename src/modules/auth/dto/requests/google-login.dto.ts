import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceInfoDto } from './device-info.dto';

export class GoogleLoginDto {
  @IsNotEmpty({ message: 'ID token is required' })
  @IsString({ message: 'ID token must be a string' })
  idToken: string;

  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;
}
