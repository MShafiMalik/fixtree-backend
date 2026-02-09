import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CronService } from './cron.service';
import { CronProcessor } from './cron.processor';
import { BullMQModule } from '../bullmq.module';
import { SessionsModule } from '../../modules/auth/sessions/sessions.module';
import { QUEUES } from '../../common/constants/queue.constants';

@Module({
  imports: [
    BullMQModule,
    BullModule.registerQueue({
      name: QUEUES.CRON,
    }),
    SessionsModule,
  ],
  providers: [CronService, CronProcessor],
  exports: [CronService],
})
export class CronModule {}
