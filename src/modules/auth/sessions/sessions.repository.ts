import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {}

  async create(data: Partial<Session>): Promise<Session> {
    const session = this.repository.create(data);
    return this.repository.save(session);
  }

  async findById(id: string): Promise<Session | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, data: Partial<Session>): Promise<Session | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async revoke(id: string): Promise<void> {
    await this.repository.update(id, { isRevoked: true });
  }

  async revokeAll(userId: string): Promise<void> {
    await this.repository.update({ userId }, { isRevoked: true });
  }

  async revokeOthers(userId: string, currentSessionId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Session)
      .set({ isRevoked: true })
      .where('user_id = :userId', { userId })
      .andWhere('id != :currentSessionId', { currentSessionId })
      .execute();
  }
}
