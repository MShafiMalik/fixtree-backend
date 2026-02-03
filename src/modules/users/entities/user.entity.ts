import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  // Explicit types are required for union types like string | null (otherwise TypeORM may see "Object")
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.BUYER })
  role: Role;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_phone_verified', default: false })
  isPhoneVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({
    name: 'google_id',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  @Index()
  googleId: string | null;

  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImage: string | null;

  // Address fields
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ name: 'postal_code', type: 'varchar', length: 20, nullable: true })
  postalCode: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  // Marketing preferences
  @Column({ name: 'accepts_marketing_emails', default: false })
  acceptsMarketingEmails: boolean;

  @Column({
    name: 'email_verification_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  emailVerificationToken: string | null;

  @Column({
    name: 'email_verification_expires',
    type: 'timestamptz',
    nullable: true,
  })
  emailVerificationExpires: Date | null;

  @Column({
    name: 'password_reset_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  passwordResetToken: string | null;

  @Column({
    name: 'password_reset_expires',
    type: 'timestamptz',
    nullable: true,
  })
  passwordResetExpires: Date | null;
}
