import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AdminUserResponseDto } from './dto/responses';
import { MessageResponseDto } from '../../auth/dto/responses';
import { PaginationResponseDto } from '../../../common/dto/responses';
import { PaginationDto } from '../../../common/dto/requests';

@Controller('admin/users')
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  findAll(
    @Query() dto: PaginationDto,
  ): Promise<PaginationResponseDto<AdminUserResponseDto>> {
    return this.adminUsersService.findAll(dto);
  }

  @Post('ban/:id')
  ban(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.adminUsersService.ban(id);
  }

  @Post('unban/:id')
  unban(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.adminUsersService.unban(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdminUserResponseDto> {
    return this.adminUsersService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.adminUsersService.delete(id);
  }
}
