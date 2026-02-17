import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  @Index()
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'icon', type: 'varchar', length: 255, nullable: true })
  icon: string | null;

  @Column({
    name: 'minimum_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  minimumPrice: number | null;

  @Column({
    name: 'maximum_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maximumPrice: number | null;

  @Column({
    name: 'platform_commission_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  platformCommissionRate: number | null;

  // BaseEntity provides: id, createdAt, updatedAt, deletedAt (soft delete)
}
