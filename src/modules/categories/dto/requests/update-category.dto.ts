import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  // Override name to make it properly optional (remove @IsNotEmpty validation)
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Plumbing',
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  declare name?: string;

  // Icon field for file upload (separate from body)
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Category icon file upload (optional). Leave empty to remove existing icon.',
  })
  @IsString()
  @IsOptional()
  declare icon?: string;
}
