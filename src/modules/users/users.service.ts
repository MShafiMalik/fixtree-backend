import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UtilService } from '../../common/util/util.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly utilService: UtilService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password if provided
    if (createUserDto.password) {
      createUserDto.password = await this.utilService.hashPassword(
        createUserDto.password,
      );
    }

    return this.usersRepository.create(createUserDto);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findByGoogleId(googleId);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const updated = await this.usersRepository.update(user.id, updateUserDto);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async setEmailVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      emailVerificationToken: token,
      emailVerificationExpires: expiresAt,
    });
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.usersRepository.findByEmailVerificationToken(token);
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      throw new ConflictException('Verification token has expired');
    }

    const updated = await this.usersRepository.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  async setPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expiresAt,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await this.usersRepository.findByPasswordResetToken(token);
    if (!user) {
      throw new NotFoundException('Invalid reset token');
    }

    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new ConflictException('Reset token has expired');
    }

    const hashedPassword = await this.utilService.hashPassword(newPassword);

    const updated = await this.usersRepository.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.utilService.hashPassword(newPassword);
    await this.usersRepository.update(userId, { password: hashedPassword });
  }

  async findOrCreateByGoogle(googleData: {
    googleId: string;
    email: string;
    name: string;
    profileImage?: string;
  }): Promise<User> {
    // First try to find by googleId
    let user = await this.usersRepository.findByGoogleId(googleData.googleId);
    if (user) {
      return user;
    }

    // Then try to find by email (link accounts)
    user = await this.usersRepository.findByEmail(googleData.email);
    if (user) {
      // Link Google account to existing user
      const updated = await this.usersRepository.update(user.id, {
        googleId: googleData.googleId,
        isEmailVerified: true, // Google verified the email
        profileImage: user.profileImage ?? googleData.profileImage ?? null,
      });
      if (!updated) {
        throw new NotFoundException('User not found');
      }
      return updated;
    }

    // Create new user
    return this.usersRepository.create({
      email: googleData.email,
      name: googleData.name,
      googleId: googleData.googleId,
      profileImage: googleData.profileImage,
    });
  }
}
