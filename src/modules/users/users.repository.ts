import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.repository.findOne({ where: { googleId } });
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return this.repository.findOne({
      where: { emailVerificationToken: token },
    });
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { passwordResetToken: token } });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    includeDeleted?: boolean;
    search?: string;
    role?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
  }): Promise<{ users: User[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('user');

    if (options?.includeDeleted) {
      queryBuilder.withDeleted();
    }

    // Apply filters
    if (options?.search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options?.role) {
      queryBuilder.andWhere('user.role = :role', { role: options.role });
    }

    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    if (options?.isEmailVerified !== undefined) {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified: options.isEmailVerified,
      });
    }

    if (options?.isPhoneVerified !== undefined) {
      queryBuilder.andWhere('user.isPhoneVerified = :isPhoneVerified', {
        isPhoneVerified: options.isPhoneVerified,
      });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.repository.count({ where: { phone } });
    return count > 0;
  }
}
