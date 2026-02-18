import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PlanResponseDto } from './dto/responses';
import { GetPlansQueryDto } from './dto/requests';
import { PaginationResponseDto } from '../../common/dto/responses';

@Controller('plans')
@ApiTags('Plans')
@ApiBearerAuth('JWT-auth')
@Roles(Role.SELLER) // Only sellers can view plans
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'List all plans (SELLER only)' })
  @ApiQuery({ name: 'countryCode', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isDefault', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    type: PaginationResponseDto<PlanResponseDto>,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only sellers can access plans',
  })
  async findAll(
    @Query() queryDto: GetPlansQueryDto,
  ): Promise<PaginationResponseDto<PlanResponseDto>> {
    // For sellers, default to active plans only
    queryDto.isActive ??= true;
    return this.plansService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan by ID (SELLER only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: PlanResponseDto })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only sellers can access plans',
  })
  async findById(@Param('id') id: string): Promise<PlanResponseDto> {
    return this.plansService.findOne(id);
  }
}
