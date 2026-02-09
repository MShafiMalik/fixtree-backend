import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../common/constants/queue.constants';
import { NotificationsRepository } from './notifications.repository';
import { NotificationChannel } from '../../common/enums/notifications/notification-channel.enum';
import { NotificationType } from '../../common/enums/notifications/notification-type.enum';
import { NotificationSendEmailDto } from './dto/send-email.dto';
import { SendSmsDto } from './dto/send-sms.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue(QUEUES.NOTIFICATIONS)
    private readonly notificationsQueue: Queue,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  /**
   * Converts NotificationType enum to kebab-case job name
   * Example: WELCOME_EMAIL -> welcome-email
   */
  private getJobName(type: NotificationType): string {
    return type.toLowerCase().replace(/_/g, '-');
  }

  async sendEmail(options: NotificationSendEmailDto): Promise<void> {
    // Create notification record
    const notification = await this.notificationsRepository.create({
      userId: options.userId,
      channel: NotificationChannel.EMAIL,
      type: options.type,
      recipient: options.to,
      subject: options.subject,
      content: options.html ?? options.text ?? '',
      metadata: {
        ...options.metadata,
        templateId: options.templateId,
        dynamicTemplateData: options.dynamicTemplateData,
      },
    });

    // Add job to queue
    await this.notificationsQueue.add(this.getJobName(options.type), {
      notificationId: notification.id,
      channel: NotificationChannel.EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      templateId: options.templateId,
      dynamicTemplateData: options.dynamicTemplateData,
    });
  }

  async sendSms(options: SendSmsDto): Promise<void> {
    // Create notification record
    const notification = await this.notificationsRepository.create({
      userId: options.userId,
      channel: NotificationChannel.SMS,
      type: options.type,
      recipient: options.to,
      subject: null,
      content: options.message,
      metadata: options.metadata,
    });

    // Add job to queue
    await this.notificationsQueue.add(this.getJobName(options.type), {
      notificationId: notification.id,
      channel: NotificationChannel.SMS,
      to: options.to,
      message: options.message,
    });
  }
}
