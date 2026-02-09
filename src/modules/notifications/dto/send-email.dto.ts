import { IsUUID, IsOptional, IsEnum, IsObject } from 'class-validator';
import { NotificationType } from '../../../common/enums/notifications/notification-type.enum';
import { SendEmailDto as SendGridSendEmailDto } from '../../../shared/sendgrid/dto/send-email.dto';

/**
 * DTO for sending email notifications via the notifications service
 * Extends SendGrid DTO with notification-specific fields
 */
export class NotificationSendEmailDto extends SendGridSendEmailDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
