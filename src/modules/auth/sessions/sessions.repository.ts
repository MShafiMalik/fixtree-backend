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

  async cleanupExpiredSessions(cutoffDate: Date): Promise<{
    revoked: number;
    expired: number;
  }> {
    // Run both delete operations in parallel for better performance
    const [revokedResult, expiredResult] = await Promise.all([
      // Delete revoked sessions older than cutoff date
      this.repository
        .createQueryBuilder()
        .delete()
        .from(Session)
        .where('is_revoked = :isRevoked', { isRevoked: true })
        .andWhere('updated_at < :cutoffDate', { cutoffDate })
        .execute(),
      // Delete expired sessions (if expiresAt is set and in the past)
      this.repository
        .createQueryBuilder()
        .delete()
        .from(Session)
        .where('expires_at IS NOT NULL')
        .andWhere('expires_at < :now', { now: new Date() })
        .execute(),
    ]);

    return {
      revoked: revokedResult.affected ?? 0,
      expired: expiredResult.affected ?? 0,
    };
  }
}
