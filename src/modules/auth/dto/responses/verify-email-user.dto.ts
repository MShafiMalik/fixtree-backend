import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/enums/role.enum';

export class VerifyEmailUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ nullable: true })
  email: string | null;

  @ApiProperty({ enum: Role })
  role: Role;
}
