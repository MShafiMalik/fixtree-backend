import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminUsersModule } from './users/admin-users.module';
import { AdminCategoriesModule } from './categories/admin-categories.module';

@Module({
  imports: [AdminAuthModule, AdminUsersModule, AdminCategoriesModule],
})
export class AdminModule {}
