import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsIn,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../../../common/enums/role.enum';
import { DeviceInfoDto } from './device-info.dto';
import { AtLeastOne } from '../../../../common/validators/at-least-one.validator';

export class RegisterDto {
  @AtLeastOne(['email', 'phone'], {
    message: 'Either email or phone is required',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase, one lowercase, one number, and one special character',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsIn([Role.BUYER, Role.SELLER], {
    message: 'Role must be either BUYER or SELLER',
  })
  @IsOptional()
  role?: Role.BUYER | Role.SELLER;

  @IsString()
  @IsOptional()
  profileImage?: string;

  // Address fields
  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  address?: string;

  // Marketing preferences
  @IsBoolean()
  @IsOptional()
  acceptsMarketingEmails?: boolean;

  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;
}
