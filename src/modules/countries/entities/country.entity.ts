import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Plan } from '../../plans/entities/plan.entity';

@Entity('countries')
export class Country extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @Index()
  name: string; // Country name (e.g., 'United States', 'United Kingdom')

  @Column({ type: 'varchar', length: 10, unique: true })
  @Index({ unique: true })
  code: string; // Country code (e.g., 'US', 'UK', 'CA')

  @Column({ type: 'varchar', length: 10, nullable: true })
  currencyCode: string | null; // Currency code (e.g., 'USD', 'GBP', 'CAD')

  @Column({ type: 'varchar', length: 10, nullable: true })
  currencySymbol: string | null; // Currency symbol (e.g., '$', '£', 'C$')

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @Index()
  isActive: boolean; // Whether country is active

  // Relationships
  @OneToMany(() => Plan, (plan) => plan.country)
  plans: Plan[];
}
