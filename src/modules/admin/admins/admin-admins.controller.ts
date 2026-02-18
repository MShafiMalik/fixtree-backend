import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminAdminsService } from './admin-admins.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { PaginationResponseDto } from 'src/common/dto/responses';
import { AdminResponseDto } from './dto/responses';
import { CreateAdminDto, GetAdminsQueryDto } from './dto/requests';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin-admins')
@Roles(Role.SUPER_ADMIN)
export class AdminAdminsController {
  constructor(private readonly adminAdminsService: AdminAdminsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new admin user',
    description:
      'Super Admin only - Creates a new user with ADMIN role. Requires either email or phone (at least one).',
  })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    type: AdminResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Either email or phone is required',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin only' })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminAdminsService.createAdmin(createAdminDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all admin users',
    description:
      'Super Admin only - Lists all users with ADMIN role with pagination and optional search',
  })
  @ApiResponse({
    status: 200,
    description: 'Admins retrieved successfully',
    type: PaginationResponseDto<AdminResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin only' })
  getAllAdmins(
    @Query() queryDto: GetAdminsQueryDto,
  ): Promise<PaginationResponseDto<AdminResponseDto>> {
    return this.adminAdminsService.getAllAdmins(queryDto);
  }
}
