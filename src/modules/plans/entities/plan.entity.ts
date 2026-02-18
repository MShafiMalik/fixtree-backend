import { Entity, Column, Index, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Country } from '../../countries/entities/country.entity';

@Entity('plans')
@Unique(['name', 'countryId']) // Same plan name can exist for different countries
export class Plan extends BaseEntity {
  // ========== Plan Identification ==========
  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string; // Plan name: 'Basic', 'Plus', 'Premium'

  @Column({ name: 'country_id', type: 'uuid' })
  @Index()
  countryId: string; // Country ID (foreign key)

  @ManyToOne(() => Country, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id' })
  country: Country; // Country relationship

  @Column({ type: 'text', nullable: true })
  description: string | null; // Plan description

  // ========== Plan Features & Limits ==========
  @Column({ name: 'service_limit', type: 'int' })
  serviceLimit: number; // Maximum number of services allowed (5, 10, or 30)

  @Column({ type: 'int' })
  price: number; // Plan price in cents (country-specific)

  @Column({ name: 'can_extend_booking_time', type: 'boolean', default: false })
  canExtendBookingTime: boolean; // Premium feature: can extend booking auto-cancellation time

  // ========== Plan Status ==========
  @Column({ name: 'is_default', type: 'boolean', default: false })
  @Index()
  isDefault: boolean; // True for Basic plan (auto-assigned to new sellers)

  @Column({ name: 'is_active', type: 'boolean', default: true })
  @Index()
  isActive: boolean; // Whether plan is available for subscription

  // BaseEntity provides: id, createdAt, updatedAt, deletedAt
}
