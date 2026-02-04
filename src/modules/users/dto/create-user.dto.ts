import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum';
import { AtLeastOne } from '../../../common/validators/at-least-one.validator';

export class CreateUserDto {
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
  @IsOptional()
  password?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  googleId?: string;

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
}
