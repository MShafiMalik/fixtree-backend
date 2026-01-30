import { Role } from '../../../common/enums/role.enum';

export interface SuperAdminSeedData {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export const getSuperAdminSeedData = (): SuperAdminSeedData => ({
  email: process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@fixtree.com',
  password: process.env.SUPER_ADMIN_PASSWORD ?? 'SuperAdmin@123',
  name: 'Super Admin',
  role: Role.SUPER_ADMIN,
});
