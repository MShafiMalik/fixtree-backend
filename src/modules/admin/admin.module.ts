import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminUsersModule } from './users/admin-users.module';
import { AdminCategoriesModule } from './categories/admin-categories.module';
import { AdminAdminsModule } from './admins/admin-admins.module';
import { AdminPlansModule } from './plans/admin-plans.module';

@Module({
  imports: [
    AdminAuthModule,
    AdminUsersModule,
    AdminAdminsModule,
    AdminPlansModule,
    AdminCategoriesModule,
  ],
})
export class AdminModule {}
