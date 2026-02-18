import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Plan name (Basic, Plus, Premium)',
    example: 'Basic',
    enum: ['Basic', 'Plus', 'Premium'],
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Country code (e.g., US, UK, CA)',
    example: 'US',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  countryCode: string;

  @ApiPropertyOptional({
    description: 'Plan description',
    example: 'Basic plan allows up to 5 services',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Maximum number of services allowed',
    example: 5,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  serviceLimit: number;

  @ApiProperty({
    description:
      'Plan price in cents (country-specific). Example: 999 for $9.99',
    example: 999,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  price: number; // Price in cents (integer)

  @ApiPropertyOptional({
    description: 'Can extend booking auto-cancellation time (Premium feature)',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  canExtendBookingTime?: boolean;

  @ApiPropertyOptional({
    description: 'Is default plan (auto-assigned to new sellers)',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Whether plan is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
