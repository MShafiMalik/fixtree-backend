import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '../../entities/plan.entity';

export class PlanResponseDto {
  @ApiProperty({
    description: 'Plan ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Plan name',
    example: 'Basic',
  })
  name: string;

  @ApiProperty({
    description: 'Country information',
    example: { id: 'uuid', name: 'United States', code: 'US' },
  })
  country: {
    id: string;
    name: string;
    code: string;
    currencyCode: string | null;
    currencySymbol: string | null;
  };

  @ApiProperty({
    description: 'Plan description',
    example: 'Basic plan allows up to 5 services',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Maximum number of services allowed',
    example: 5,
  })
  serviceLimit: number;

  @ApiProperty({
    description: 'Plan price in cents. Example: 999 for $9.99',
    example: 999,
  })
  price: number; // Price in cents (integer)

  @ApiProperty({
    description: 'Can extend booking auto-cancellation time',
    example: false,
  })
  canExtendBookingTime: boolean;

  @ApiProperty({
    description: 'Is default plan (auto-assigned to new sellers)',
    example: false,
  })
  isDefault: boolean;

  @ApiProperty({
    description: 'Whether plan is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Plan creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Plan last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(plan: Plan) {
    this.id = plan.id;
    this.name = plan.name;
    this.country = {
      id: plan.country.id,
      name: plan.country.name,
      code: plan.country.code,
      currencyCode: plan.country.currencyCode ?? null,
      currencySymbol: plan.country.currencySymbol ?? null,
    };
    this.description = plan.description ?? null;
    this.serviceLimit = plan.serviceLimit;
    this.price = plan.price; // Price in cents (already integer from DB)
    this.canExtendBookingTime = plan.canExtendBookingTime;
    this.isDefault = plan.isDefault;
    this.isActive = plan.isActive;
    this.createdAt = plan.createdAt;
    this.updatedAt = plan.updatedAt;
  }
}
