import { IsUUID, IsEnum, IsString } from 'class-validator';
import { NotificationChannel } from '../../../common/enums/notifications/notification-channel.enum';

export class SmsJobDataDto {
  @IsUUID()
  notificationId: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel.SMS;

  @IsString()
  to: string;

  @IsString()
  message: string;
}
