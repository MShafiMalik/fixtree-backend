import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlansRepository {
  constructor(
    @InjectRepository(Plan)
    private readonly repository: Repository<Plan>,
  ) {}

  async create(data: Partial<Plan>): Promise<Plan> {
    const plan = this.repository.create(data);
    return this.save(plan);
  }

  async findById(id: string, includeDeleted = false): Promise<Plan | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.country', 'country')
      .where('plan.id = :id', { id });

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    return queryBuilder.getOne();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    countryCode?: string;
    countryId?: string;
    isActive?: boolean;
    isDefault?: boolean;
    includeDeleted?: boolean;
  }): Promise<{ plans: Plan[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.country', 'country');

    if (options?.includeDeleted) {
      queryBuilder.withDeleted();
    }

    if (options?.countryCode) {
      queryBuilder.andWhere('country.code = :countryCode', {
        countryCode: options.countryCode,
      });
    }

    if (options?.countryId) {
      queryBuilder.andWhere('plan.countryId = :countryId', {
        countryId: options.countryId,
      });
    }

    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('plan.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    if (options?.isDefault !== undefined) {
      queryBuilder.andWhere('plan.isDefault = :isDefault', {
        isDefault: options.isDefault,
      });
    }

    queryBuilder.orderBy('plan.createdAt', 'DESC');

    const [plans, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { plans, total };
  }

  async findByCountryCode(
    countryCode: string,
    isActive?: boolean,
  ): Promise<Plan[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.country', 'country')
      .where('country.code = :countryCode', { countryCode })
      .andWhere('plan.deletedAt IS NULL');

    if (isActive !== undefined) {
      queryBuilder.andWhere('plan.isActive = :isActive', { isActive });
    }

    queryBuilder.orderBy('plan.serviceLimit', 'ASC');

    return queryBuilder.getMany();
  }

  async findByCountryId(
    countryId: string,
    isActive?: boolean,
  ): Promise<Plan[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.country', 'country')
      .where('plan.countryId = :countryId', { countryId })
      .andWhere('plan.deletedAt IS NULL');

    if (isActive !== undefined) {
      queryBuilder.andWhere('plan.isActive = :isActive', { isActive });
    }

    queryBuilder.orderBy('plan.serviceLimit', 'ASC');

    return queryBuilder.getMany();
  }

  async findDefaultByCountryCode(countryCode: string): Promise<Plan | null> {
    return this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.country', 'country')
      .where('country.code = :countryCode', { countryCode })
      .andWhere('plan.isDefault = :isDefault', { isDefault: true })
      .andWhere('plan.isActive = :isActive', { isActive: true })
      .andWhere('plan.deletedAt IS NULL')
      .getOne();
  }

  async findDefaultByCountryId(countryId: string): Promise<Plan | null> {
    return this.repository.findOne({
      where: {
        countryId,
        isDefault: true,
        isActive: true,
        deletedAt: IsNull(),
      },
      relations: ['country'],
    });
  }

  async findByNameAndCountryId(
    name: string,
    countryId: string,
    includeDeleted = false,
  ): Promise<Plan | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.country', 'country')
      .where('plan.name = :name', { name })
      .andWhere('plan.countryId = :countryId', { countryId });

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    return queryBuilder.getOne();
  }

  async update(id: string, data: Partial<Plan>): Promise<Plan> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`Plan with ID ${id} not found after update`);
    }
    return updated;
  }

  async save(plan: Plan): Promise<Plan> {
    return await this.repository.save(plan);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }
}
