import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { UtilModule } from '../../common/util/util.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UtilModule],
  providers: [CategoriesRepository, CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
