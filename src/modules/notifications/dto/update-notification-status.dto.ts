import { IsEnum, IsOptional, IsDate, IsString } from 'class-validator';
import { NotificationStatus } from '../../../common/enums/notifications/notification-status.enum';

export class UpdateNotificationStatusDto {
  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @IsDate()
  @IsOptional()
  sentAt?: Date;

  @IsDate()
  @IsOptional()
  deliveredAt?: Date;

  @IsString()
  @IsOptional()
  errorMessage?: string | null;
}
