import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ format: 'email', example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ minLength: 8, maxLength: 100, example: 'Pass@1234' })
  @AtLeastOne(['email', 'phone'], {
    message: 'Either email or phone is required',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase, one lowercase, one number, and one special character',
  })
  password: string;

  @ApiProperty({ minLength: 2, maxLength: 100, example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ enum: [Role.BUYER, Role.SELLER] })
  @IsIn([Role.BUYER, Role.SELLER], {
    message: 'Role must be either BUYER or SELLER',
  })
  @IsOptional()
  role?: Role.BUYER | Role.SELLER;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Profile image file upload (use this OR profileImageUrl, not both)',
  })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    description:
      'Profile image URL (alternative to uploading profileImage file)',
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiPropertyOptional({ example: 'United States' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'California' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'San Francisco' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: '94102' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ example: '123 Main Street, Apt 4B' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  acceptsMarketingEmails?: boolean;

  @ApiPropertyOptional({ type: () => DeviceInfoDto })
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsOptional()
  deviceInfo?: DeviceInfoDto;
}
