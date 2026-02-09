import {
  IsUUID,
  IsEnum,
  IsEmail,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { NotificationChannel } from '../../../common/enums/notifications/notification-channel.enum';

export class EmailJobDataDto {
  @IsUUID()
  notificationId: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel.EMAIL;

  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsObject()
  @IsOptional()
  dynamicTemplateData?: Record<string, unknown>;
}
