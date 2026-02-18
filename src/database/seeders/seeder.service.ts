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
import { CountriesModule } from '../../modules/countries/countries.module';
import { CountriesRepository } from '../../modules/countries/countries.repository';
import { PlansModule } from '../../modules/plans/plans.module';
import { PlansRepository } from '../../modules/plans/plans.repository';
import { CountriesService } from '../../modules/countries/countries.service';
import { getCountriesSeedData } from './data/countries.seed';
import { getPlansSeedData } from './data/plans.seed';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly utilService: UtilService,
    private readonly countriesRepository: CountriesRepository,
    private readonly countriesService: CountriesService,
    private readonly plansRepository: PlansRepository,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting database seeding...');

    try {
      await this.seedSuperAdmin();
      await this.seedCountries();
      await this.seedPlans();
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

  private async seedCountries(): Promise<void> {
    const countries = getCountriesSeedData();

    for (const countryData of countries) {
      const existing = await this.countriesRepository.findByCode(
        countryData.code,
      );

      if (existing) {
        this.logger.log(
          `Country already exists (${countryData.code}) - skipping`,
        );
        continue;
      }

      await this.countriesRepository.create({
        name: countryData.name,
        code: countryData.code,
        currencyCode: countryData.currencyCode,
        currencySymbol: countryData.currencySymbol,
        isActive: true,
      });

      this.logger.log(
        `Country created (${countryData.name} - ${countryData.code})`,
      );
    }
  }

  private async seedPlans(): Promise<void> {
    const plans = getPlansSeedData();

    for (const planData of plans) {
      try {
        // Get country by code
        const country = await this.countriesService.findByCode(
          planData.countryCode,
        );

        // Check if plan already exists
        const existing = await this.plansRepository.findByNameAndCountryId(
          planData.name,
          country.id,
        );

        if (existing) {
          this.logger.log(
            `Plan already exists (${planData.name} for ${planData.countryCode}) - skipping`,
          );
          continue;
        }

        await this.plansRepository.create({
          name: planData.name,
          countryId: country.id,
          description: planData.description,
          serviceLimit: planData.serviceLimit,
          price: planData.price,
          canExtendBookingTime: planData.canExtendBookingTime,
          isDefault: planData.isDefault,
          isActive: true,
        });

        this.logger.log(
          `Plan created (${planData.name} for ${planData.countryCode})`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to create plan ${planData.name} for ${planData.countryCode}:`,
          error,
        );
      }
    }
  }
}

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UtilModule,
    UsersModule,
    CountriesModule,
    PlansModule,
  ],
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
