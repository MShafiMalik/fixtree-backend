import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminPlansService } from './admin-plans.service';
import { PlansService } from '../../plans/plans.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import {
  CreatePlanDto,
  UpdatePlanDto,
  GetPlansQueryDto,
} from '../../plans/dto/requests';
import { PlanResponseDto } from '../../plans/dto/responses';
import { PaginationResponseDto } from '../../../common/dto/responses';

@Controller('admin/plans')
@ApiTags('Admin Plans')
@ApiBearerAuth('JWT-auth')
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminPlansController {
  constructor(
    private readonly adminPlansService: AdminPlansService,
    private readonly plansService: PlansService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create plan (ADMIN, SUPER_ADMIN)' })
  @ApiResponse({ status: 201, type: PlanResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'Plan already exists for this country',
  })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.adminPlansService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all plans (ADMIN, SUPER_ADMIN)' })
  @ApiQuery({ name: 'countryCode', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isDefault', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    type: PaginationResponseDto<PlanResponseDto>,
  })
  async findAll(
    @Query() queryDto: GetPlansQueryDto,
    @Query('includeDeleted', new DefaultValuePipe(false), ParseBoolPipe)
    includeDeleted: boolean,
  ): Promise<PaginationResponseDto<PlanResponseDto>> {
    queryDto.includeDeleted = includeDeleted;
    return this.plansService.findAll(queryDto, includeDeleted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan by ID (ADMIN, SUPER_ADMIN)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include soft-deleted plans (default: true for admins)',
  })
  @ApiResponse({ status: 200, type: PlanResponseDto })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findById(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ): Promise<PlanResponseDto> {
    // Admins can see deleted plans by default (includeDeleted defaults to true)
    return this.plansService.findOne(id, includeDeleted ?? true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update plan (ADMIN, SUPER_ADMIN)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: PlanResponseDto })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @ApiResponse({
    status: 409,
    description: 'Plan already exists for this country',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.adminPlansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete plan (ADMIN, SUPER_ADMIN, soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete default plan' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.adminPlansService.remove(id);
  }
}
