import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum';
import { AuthCredentialsBaseDto } from 'src/modules/auth/dto/requests';

export class CreateUserDto extends AuthCredentialsBaseDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

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
