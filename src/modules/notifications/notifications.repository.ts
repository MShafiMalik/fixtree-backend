import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationStatus } from '../../common/enums/notifications/notification-status.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    const notification = this.repository.create({
      userId: data.userId,
      channel: data.channel,
      type: data.type,
      recipient: data.recipient,
      subject: data.subject ?? null,
      content: data.content,
      metadata: data.metadata ?? null,
      status: NotificationStatus.PENDING,
    });
    return this.repository.save(notification);
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateStatus(
    id: string,
    data: UpdateNotificationStatusDto,
  ): Promise<void> {
    await this.repository.update(id, data);
  }
}
