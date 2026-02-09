import {
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { NotificationChannel } from '../../../common/enums/notifications/notification-channel.enum';
import { NotificationType } from '../../../common/enums/notifications/notification-type.enum';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  recipient: string;

  @IsString()
  @IsOptional()
  subject?: string | null;

  @IsString()
  content: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> | null;
}
