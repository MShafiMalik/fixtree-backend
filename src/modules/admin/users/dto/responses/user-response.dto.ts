import { Role } from '../../../../../common/enums/role.enum';

export class AdminUserResponseDto {
  id: string;
  email: string | null;
  name: string;
  phone: string | null;
  role: Role;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  profileImage: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  postalCode: string | null;
  address: string | null;
  acceptsMarketingEmails: boolean;
  createdAt: Date;
  updatedAt: Date;
}
