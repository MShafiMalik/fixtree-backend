import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

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
    // Will be implemented after User entity is created in Stage 5
    this.logger.log(
      'Super admin seeding will be implemented after User entity is created',
    );
    await Promise.resolve();
  }
}
