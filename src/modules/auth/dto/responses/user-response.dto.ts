import { Role } from '../../../../common/enums/role.enum';

export class UserResponseDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  role: Role;
  country: string | null;
  state: string | null;
  city: string | null;
  postalCode: string | null;
  address: string | null;
}
