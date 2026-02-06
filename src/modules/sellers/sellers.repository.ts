import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { addSafeUserFields } from '../../common/util/query-helpers';

@Injectable()
export class SellersRepository {
  constructor(
    @InjectRepository(Seller)
    private readonly repository: Repository<Seller>,
  ) {}

  async create(data: Partial<Seller>): Promise<Seller> {
    const seller = this.repository.create(data);
    return this.repository.save(seller);
  }

  async findByUserId(userId: string): Promise<Seller | null> {
    return this.repository
      .createQueryBuilder('seller')
      .leftJoinAndSelect('seller.user', 'user')
      .where('seller.userId = :userId', { userId })
      .select([
        'seller.id',
        'seller.userId',
        'seller.isActive',
        'seller.createdAt',
        'seller.updatedAt',
        ...addSafeUserFields('user'),
      ])
      .getOne();
  }

  async findAll(): Promise<Seller[]> {
    return this.repository
      .createQueryBuilder('seller')
      .leftJoinAndSelect('seller.user', 'user')
      .select([
        'seller.id',
        'seller.userId',
        'seller.isActive',
        'seller.createdAt',
        'seller.updatedAt',
        ...addSafeUserFields('user'),
      ])
      .orderBy('seller.createdAt', 'DESC')
      .getMany();
  }
}
