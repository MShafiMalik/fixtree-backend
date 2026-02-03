import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  password: string | null;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.BUYER })
  role: Role;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_phone_verified', default: false })
  isPhoneVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'google_id', nullable: true, unique: true })
  @Index()
  googleId: string | null;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string | null;

  // Address fields
  @Column({ nullable: true })
  country: string | null;

  @Column({ nullable: true })
  state: string | null;

  @Column({ nullable: true })
  city: string | null;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string | null;

  @Column({ nullable: true })
  address: string | null;

  // Marketing preferences
  @Column({ name: 'accepts_marketing_emails', default: false })
  acceptsMarketingEmails: boolean;

  @Column({ name: 'email_verification_token', nullable: true })
  emailVerificationToken: string | null;

  @Column({ name: 'email_verification_expires', nullable: true })
  emailVerificationExpires: Date | null;

  @Column({ name: 'password_reset_token', nullable: true })
  passwordResetToken: string | null;

  @Column({ name: 'password_reset_expires', nullable: true })
  passwordResetExpires: Date | null;
}
