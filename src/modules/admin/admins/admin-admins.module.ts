import { Module } from '@nestjs/common';
import { AdminAdminsService } from './admin-admins.service';
import { AdminAdminsController } from './admin-admins.controller';
import { UsersModule } from '../../users/users.module';
import { UtilModule } from '../../../common/util/util.module';

@Module({
  imports: [UsersModule, UtilModule],
  controllers: [AdminAdminsController],
  providers: [AdminAdminsService],
})
export class AdminAdminsModule {}
