import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './entities/category.entity';
import { PaginationDto } from '../../common/dto/requests';
import { PaginationResponseDto } from '../../common/dto/responses';
import { UtilService } from '../../common/util/util.service';
import { CategoryResponseDto } from './dto/responses';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly utilService: UtilService,
  ) {}

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginationResponseDto<CategoryResponseDto>> {
    const { page, limit } = this.utilService.getPaginationParams(
      paginationDto ?? {},
    );

    const { categories, total } = await this.categoriesRepository.findAll({
      page,
      limit,
    });

    const items = categories.map((cat) => new CategoryResponseDto(cat));

    return new PaginationResponseDto(items, total, page, limit);
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
}
