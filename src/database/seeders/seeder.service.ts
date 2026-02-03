import { Injectable, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../database.module';
import { UtilModule } from '../../common/util/util.module';
import { UsersModule } from '../../modules/users/users.module';
import { UsersRepository } from '../../modules/users/users.repository';
import { UtilService } from '../../common/util/util.service';
import { Role } from '../../common/enums/role.enum';
import { getSuperAdminSeedData } from './data/super-admin.seed';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly utilService: UtilService,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting database seeding...');

    try {
      await this.seedSuperAdmin();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Database seeding failed', error);
      throw error;
    }
  }

  private async seedSuperAdmin(): Promise<void> {
    const seed = getSuperAdminSeedData();

    const existing = await this.usersRepository.findByEmail(seed.email);
    if (existing) {
      if (existing.role === Role.SUPER_ADMIN) {
        this.logger.log(
          `Super admin already exists (${seed.email}) - skipping`,
        );
        return;
      }

      this.logger.warn(
        `User with SUPER_ADMIN_EMAIL already exists but is not SUPER_ADMIN (${seed.email}, role=${existing.role}) - skipping`,
      );
      return;
    }

    const hashedPassword = await this.utilService.hashPassword(seed.password);

    await this.usersRepository.create({
      email: seed.email,
      password: hashedPassword,
      name: seed.name,
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
      acceptsMarketingEmails: false,
    });

    this.logger.log(`Super admin created (${seed.email})`);
  }
}

@Module({
  imports: [AppConfigModule, DatabaseModule, UtilModule, UsersModule],
  providers: [SeederService],
})
class SeederAppModule {}

async function bootstrap(): Promise<void> {
  // Only run when executed directly via ts-node
  const app = await NestFactory.createApplicationContext(SeederAppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    await app.get(SeederService).seed();
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void bootstrap();
}
