import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminUsersModule } from './users/admin-users.module';
import { AdminAdminsModule } from './admins/admin-admins.module';

@Module({
  imports: [AdminAuthModule, AdminUsersModule, AdminAdminsModule],
})
export class AdminModule {}
