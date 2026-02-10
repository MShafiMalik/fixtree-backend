import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AdminUserResponseDto } from './dto/responses';
import { MessageResponseDto } from '../../auth/dto/responses';
import { PaginationResponseDto } from '../../../common/dto/responses';
import { PaginationDto } from '../../../common/dto/requests';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin/users')
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: PaginationResponseDto<AdminUserResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query() dto: PaginationDto,
  ): Promise<PaginationResponseDto<AdminUserResponseDto>> {
    return this.adminUsersService.findAll(dto);
  }

  @Post('ban/:id')
  @ApiOperation({ summary: 'Ban a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User banned successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  ban(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.adminUsersService.ban(id);
  }

  @Post('unban/:id')
  @ApiOperation({ summary: 'Unban a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User unbanned successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  unban(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.adminUsersService.unban(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: AdminUserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): Promise<AdminUserResponseDto> {
    return this.adminUsersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  delete(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.adminUsersService.delete(id);
  }
}
