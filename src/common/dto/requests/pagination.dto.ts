import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { APP_CONSTANTS } from '../../constants/app.constants';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: APP_CONSTANTS.DEFAULT_PAGE,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = APP_CONSTANTS.DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: APP_CONSTANTS.DEFAULT_LIMIT,
    minimum: 1,
    maximum: APP_CONSTANTS.MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(APP_CONSTANTS.MAX_LIMIT)
  limit?: number = APP_CONSTANTS.DEFAULT_LIMIT;
}
