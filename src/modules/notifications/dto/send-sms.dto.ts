import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';
import { NotificationType } from '../../../common/enums/notifications/notification-type.enum';

export class SendSmsDto {
  @IsUUID()
  userId: string;

  @IsString()
  to: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
