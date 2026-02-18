import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { UtilService } from '../../../common/util/util.service';
import { User } from '../../users/entities/user.entity';
import { AdminResponseDto } from './dto/responses';
import { Role } from '../../../common/enums/role.enum';
import { CreateAdminDto, GetAdminsQueryDto } from './dto/requests';
import { PaginationResponseDto } from '../../../common/dto/responses';

@Injectable()
export class AdminAdminsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly utilService: UtilService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    if (createAdminDto.email) {
      const existingUser = await this.usersRepository.findByEmail(
        createAdminDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if phone already exists (if provided)
    if (createAdminDto.phone) {
      const existingPhone = await this.usersRepository.findByPhone(
        createAdminDto.phone,
      );
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Hash password
    const hashedPassword = await this.utilService.hashPassword(
      createAdminDto.password,
    );

    // Create admin user with role ADMIN
    const admin = await this.usersRepository.create({
      name: createAdminDto.name,
      email: createAdminDto.email ?? null,
      password: hashedPassword,
      phone: createAdminDto.phone ?? null,
      role: Role.ADMIN,
      isEmailVerified: !!createAdminDto.email, // Auto-verify if email provided
      isPhoneVerified: !!createAdminDto.phone, // Auto-verify if phone provided
      isActive: true,
    });

    return this.toAdminResponseDto(admin);
  }

  async getAllAdmins(
    queryDto: GetAdminsQueryDto,
  ): Promise<PaginationResponseDto<AdminResponseDto>> {
    const { page, limit } = this.utilService.getPaginationParams({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    // Parse isActive filter
    const isActive =
      queryDto.isActive === undefined
        ? undefined
        : queryDto.isActive === 'true';

    const { users, total } = await this.usersRepository.findAll({
      page,
      limit,
      search: queryDto.search,
      role: Role.ADMIN,
      isActive,
    });

    const items: AdminResponseDto[] = users.map((user) =>
      this.toAdminResponseDto(user),
    );

    return new PaginationResponseDto<AdminResponseDto>(
      items,
      total,
      page,
      limit,
    );
  }

  private toAdminResponseDto(user: User): AdminResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      acceptsMarketingEmails: user.acceptsMarketingEmails,
      profileImage: user.profileImage,
      country: user.country,
      state: user.state,
      city: user.city,
      postalCode: user.postalCode,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
