import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { PlansRepository } from './plans.repository';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { UtilModule } from '../../common/util/util.module';
import { CountriesModule } from '../countries/countries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    UtilModule,
    CountriesModule, // Import CountriesModule to use CountriesService
  ],
  providers: [PlansRepository, PlansService],
  controllers: [PlansController],
  exports: [PlansService, PlansRepository], // Export for admin module
})
export class PlansModule {}
