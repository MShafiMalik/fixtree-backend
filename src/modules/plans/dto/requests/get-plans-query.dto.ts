import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/dto/requests/pagination.dto';

export class GetPlansQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter plans by country code',
    example: 'US',
  })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by default plan status',
    example: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Include soft-deleted plans (Admin only)',
    example: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  includeDeleted?: boolean;
}
