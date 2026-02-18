import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { PriceRange } from '../../../../common/validators/price-range.validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({ description: 'Category name', example: 'Plumbing' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Plumbing services and repairs',
  })
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Category icon file upload (required)',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @PriceRange({
    message: 'Minimum price cannot be greater than maximum price',
  })
  @ApiPropertyOptional({
    description: 'Minimum price for services in this category',
    example: 50.0,
  })
  minimumPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Maximum price for services in this category',
    example: 500.0,
  })
  maximumPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @ApiPropertyOptional({
    description: 'Platform commission rate percentage (0-100)',
    example: 15.5,
  })
  platformCommissionRate?: number;
}
