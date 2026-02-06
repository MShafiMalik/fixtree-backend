import { Role } from '../../../../common/enums/role.enum';

export class VerifyEmailUserDto {
  id: string;
  email: string | null;
  role: Role;
}
