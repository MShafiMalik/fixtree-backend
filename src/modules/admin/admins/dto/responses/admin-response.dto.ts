import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../../common/enums/role.enum';
import { AdminUserResponseDto } from 'src/modules/admin/users/dto/responses';

export class AdminResponseDto extends AdminUserResponseDto {
  @ApiProperty({ description: 'Role', enum: Role, example: Role.ADMIN })
  declare role: Role;
}
