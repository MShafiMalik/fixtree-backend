import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ nullable: true, example: 'user@example.com' })
  email: string | null;

  @ApiProperty({ nullable: true, example: '+1234567890' })
  phone: string | null;

  @ApiProperty({ nullable: true, example: 'https://example.com/profile.jpg' })
  profileImage: string | null;

  @ApiProperty({ enum: Role, example: Role.BUYER })
  role: Role;

  @ApiProperty({ nullable: true, example: 'United States' })
  country: string | null;

  @ApiProperty({ nullable: true, example: 'California' })
  state: string | null;

  @ApiProperty({ nullable: true, example: 'San Francisco' })
  city: string | null;

  @ApiProperty({ nullable: true, example: '94102' })
  postalCode: string | null;

  @ApiProperty({ nullable: true, example: '123 Main Street, Apt 4B' })
  address: string | null;
}
