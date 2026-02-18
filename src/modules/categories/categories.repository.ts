import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findAll(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ categories: Category[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('category');

    queryBuilder.where('category.deletedAt IS NULL');

    queryBuilder.orderBy('category.createdAt', 'DESC');

    const [categories, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { categories, total };
  }

  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findOneByName(name: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { name, deletedAt: IsNull() },
    });
  }

  async create(data: Partial<Category>): Promise<Category> {
    const category = this.repository.create(data);
    return this.save(category);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(
        `Category with ID ${id} not found after update`,
      );
    }
    return updated;
  }

  async save(category: Category): Promise<Category> {
    return await this.repository.save(category);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
