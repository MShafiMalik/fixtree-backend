import { PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-plan.dto';
import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @ApiPropertyOptional({
    description: 'Plan name',
    example: 'Basic',
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Country code (e.g., US, UK, CA)',
    example: 'US',
  })
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({
    description: 'Plan description',
    example: 'Updated plan description',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of services allowed',
    example: 10,
  })
  @IsOptional()
  serviceLimit?: number;

  @ApiPropertyOptional({
    description: 'Plan price in cents. Example: 1999 for $19.99',
    example: 1999,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number; // Price in cents (integer)

  @ApiPropertyOptional({
    description: 'Can extend booking auto-cancellation time',
    example: true,
  })
  @IsOptional()
  canExtendBookingTime?: boolean;

  @ApiPropertyOptional({
    description: 'Is default plan',
    example: false,
  })
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Whether plan is active',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;
}
