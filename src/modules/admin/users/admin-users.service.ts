import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UsersRepository } from '../../users/users.repository';
import { UtilService } from '../../../common/util/util.service';
import { PaginationResponseDto } from '../../../common/dto/responses/pagination-response.dto';
import { AdminUserResponseDto } from './dto/responses';
import { MessageResponseDto } from '../../auth/dto/responses';
import { User } from '../../users/entities/user.entity';
import { PaginationDto } from '../../../common/dto/requests';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly utilService: UtilService,
  ) {}

  async findAll(
    dto: PaginationDto,
  ): Promise<PaginationResponseDto<AdminUserResponseDto>> {
    const { page, limit } = this.utilService.getPaginationParams(dto);

    const { users, total } = await this.usersRepository.findAll({
      page,
      limit,
    });

    const items = users.map((user) => this.toResponseDto(user));

    return new PaginationResponseDto(items, total, page, limit);
  }

  async findOne(id: string): Promise<AdminUserResponseDto> {
    const user = await this.usersService.findById(id);
    return this.toResponseDto(user);
  }

  async delete(id: string): Promise<MessageResponseDto> {
    try {
      await this.usersRepository.softDelete(id);
      return { message: 'User deleted successfully' };
    } catch {
      throw new BadRequestException('Failed to delete user');
    }
  }

  async ban(id: string): Promise<MessageResponseDto> {
    try {
      await this.usersRepository.update(id, { isActive: false });
      return { message: 'User banned successfully' };
    } catch {
      throw new BadRequestException('Failed to ban user');
    }
  }

  async unban(id: string): Promise<MessageResponseDto> {
    try {
      await this.usersRepository.update(id, { isActive: true });
      return { message: 'User unbanned successfully' };
    } catch {
      throw new BadRequestException('Failed to unban user');
    }
  }

  private toResponseDto(user: User): AdminUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      profileImage: user.profileImage,
      country: user.country,
      state: user.state,
      city: user.city,
      postalCode: user.postalCode,
      address: user.address,
      acceptsMarketingEmails: user.acceptsMarketingEmails,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
