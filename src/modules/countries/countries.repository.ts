import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesRepository {
  constructor(
    @InjectRepository(Country)
    private readonly repository: Repository<Country>,
  ) {}

  async findByCode(code: string): Promise<Country | null> {
    return this.repository.findOne({
      where: { code, deletedAt: IsNull() },
    });
  }

  async findById(id: string): Promise<Country | null> {
    return this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findAll(): Promise<Country[]> {
    return this.repository.find({
      where: { deletedAt: IsNull(), isActive: true },
      order: { name: 'ASC' },
    });
  }

  async create(data: Partial<Country>): Promise<Country> {
    const country = this.repository.create(data);
    return this.repository.save(country);
  }
}
