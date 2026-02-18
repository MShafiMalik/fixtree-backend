import { Injectable, NotFoundException } from '@nestjs/common';
import { CountriesRepository } from './countries.repository';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(private readonly countriesRepository: CountriesRepository) {}

  async findByCode(code: string): Promise<Country> {
    const country = await this.countriesRepository.findByCode(code);
    if (!country) {
      throw new NotFoundException(`Country with code "${code}" not found`);
    }
    return country;
  }

  async findById(id: string): Promise<Country> {
    const country = await this.countriesRepository.findById(id);
    if (!country) {
      throw new NotFoundException(`Country with ID "${id}" not found`);
    }
    return country;
  }

  async findAll(): Promise<Country[]> {
    return this.countriesRepository.findAll();
  }
}
