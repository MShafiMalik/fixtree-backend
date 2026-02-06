import { Role } from '../../../../common/enums/role.enum';

export class UserResponseDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  role: Role;
}
