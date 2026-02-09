import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsRepository } from './notifications.repository';
import { Notification } from './entities/notification.entity';
import { QUEUES } from '../../common/constants/queue.constants';
import { BullMQModule } from '../../queues/bullmq.module';
import { SendGridModule } from '../../shared/sendgrid/sendgrid.module';
import { TwilioModule } from '../../shared/twilio/twilio.module';

@Module({
  imports: [
    BullMQModule,
    BullModule.registerQueue({ name: QUEUES.NOTIFICATIONS }),
    TypeOrmModule.forFeature([Notification]),
    SendGridModule,
    TwilioModule,
  ],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    NotificationsRepository,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
