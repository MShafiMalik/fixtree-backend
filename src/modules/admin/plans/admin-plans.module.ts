import { Module } from '@nestjs/common';
import { PlansModule } from '../../plans/plans.module';
import { CountriesModule } from '../../countries/countries.module';
import { AdminPlansController } from './admin-plans.controller';
import { AdminPlansService } from './admin-plans.service';

@Module({
  imports: [PlansModule, CountriesModule],
  controllers: [AdminPlansController],
  providers: [AdminPlansService],
})
export class AdminPlansModule {}
