import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Category name', example: 'Plumbing' })
  name: string;

  @ApiProperty({
    description: 'Category description',
    nullable: true,
    example: 'Plumbing services and repairs',
  })
  description?: string;

  @ApiProperty({
    description: 'Category icon',
    nullable: true,
    example: 'plumbing-icon.svg',
  })
  icon?: string;

  @ApiProperty({
    description: 'Minimum price for services in this category',
    nullable: true,
    example: 50.0,
  })
  minimumPrice?: number;

  @ApiProperty({
    description: 'Maximum price for services in this category',
    nullable: true,
    example: 500.0,
  })
  maximumPrice?: number;

  @ApiProperty({
    description: 'Platform commission rate percentage',
    nullable: true,
    example: 15.5,
  })
  platformCommissionRate?: number;

  @ApiProperty({ description: 'Created at', example: '2026-02-10T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2026-02-10T00:00:00Z' })
  updatedAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description ?? undefined;
    this.icon = category.icon ?? undefined;
    this.minimumPrice = category.minimumPrice ?? undefined;
    this.maximumPrice = category.maximumPrice ?? undefined;
    this.platformCommissionRate = category.platformCommissionRate ?? undefined;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
