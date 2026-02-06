import { Injectable, NotFoundException } from '@nestjs/common';
import { SellersRepository } from './sellers.repository';
import { Seller } from './entities/seller.entity';
import { CreateSellerDto } from './dto/requests/create-seller.dto';

@Injectable()
export class SellersService {
  constructor(private readonly sellersRepository: SellersRepository) {}

  async create(createSellerDto: CreateSellerDto): Promise<Seller> {
    const existing = await this.sellersRepository.findByUserId(
      createSellerDto.userId,
    );
    if (existing) return existing;

    return this.sellersRepository.create({ userId: createSellerDto.userId });
  }

  async getByUserId(userId: string): Promise<Seller> {
    const seller = await this.sellersRepository.findByUserId(userId);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return seller;
  }

  async findAll(): Promise<Seller[]> {
    return this.sellersRepository.findAll();
  }
}
