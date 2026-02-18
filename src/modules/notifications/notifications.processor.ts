import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES } from '../../common/constants/queue.constants';
import { NotificationsRepository } from './notifications.repository';
import { SendGridService } from '../../shared/sendgrid/sendgrid.service';
import { TwilioService } from '../../shared/twilio/twilio.service';
import { NotificationChannel } from '../../common/enums/notifications/notification-channel.enum';
import { NotificationStatus } from '../../common/enums/notifications/notification-status.enum';
import { SendEmailDto } from '../../shared/sendgrid/dto/send-email.dto';
import { EmailJobDataDto } from './dto/email-job-data.dto';
import { SmsJobDataDto } from './dto/sms-job-data.dto';

@Processor(QUEUES.NOTIFICATIONS)
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly sendGridService: SendGridService,
    private readonly twilioService: TwilioService,
  ) {
    super();
  }

  async process(job: Job<EmailJobDataDto | SmsJobDataDto>): Promise<void> {
    const { notificationId, channel } = job.data;

    try {
      if (channel === NotificationChannel.EMAIL) {
        await this.processEmail(job as Job<EmailJobDataDto>);
      } else {
        await this.processSms(job as Job<SmsJobDataDto>);
      }
    } catch (error) {
      this.logger.error(
        `Failed to process notification ${notificationId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );

      // Update notification status to FAILED
      await this.notificationsRepository.updateStatus(notificationId, {
        status: NotificationStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error; // Re-throw to mark job as failed
    }
  }

  private async processEmail(job: Job<EmailJobDataDto>): Promise<void> {
    const {
      notificationId,
      to,
      subject,
      html,
      text,
      templateId,
      dynamicTemplateData,
    } = job.data;

    this.logger.log(`Processing email notification: ${notificationId}`);

    // Send email via SendGrid
    const sendEmailDto: SendEmailDto = {
      to,
      subject,
      html,
      text,
      templateId,
      dynamicTemplateData,
    };

    if (templateId) {
      await this.sendGridService.sendTemplateEmail(
        to,
        templateId,
        dynamicTemplateData ?? {},
      );
    } else {
      await this.sendGridService.sendEmail(sendEmailDto);
    }

    // Update notification status to SENT
    await this.notificationsRepository.updateStatus(notificationId, {
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    });

    this.logger.log(`Email notification sent: ${notificationId}`);
  }

  private async processSms(job: Job<SmsJobDataDto>): Promise<void> {
    const { notificationId, to, message } = job.data;

    this.logger.log(`Processing SMS notification: ${notificationId}`);

    // Send SMS via Twilio
    await this.twilioService.sendSms(to, message);

    // Update notification status to SENT
    await this.notificationsRepository.updateStatus(notificationId, {
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    });

    this.logger.log(`SMS notification sent: ${notificationId}`);
  }
}
