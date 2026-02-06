import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { SessionsRepository } from './sessions.repository';
import { DeviceParserService } from './device-parser.service';
import { Platform } from '../../../common/enums/platform.enum';
import { Session } from './entities/session.entity';
import { SessionResponseDto } from './dto/responses';
import { APP_CONSTANTS } from '../../../common/constants/app.constants';
import { DeviceInfoDto } from '../dto/requests';
import { REDIS_CLIENT } from '../../../shared/redis/redis.constants';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly deviceParserService: DeviceParserService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis | null,
  ) {}

  async createSession(
    userId: string,
    deviceInfo?: DeviceInfoDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Session> {
    const parsed =
      deviceInfo?.platform === Platform.WEB
        ? this.deviceParserService.parse(userAgent ?? deviceInfo.userAgent)
        : {};

    const session = await this.sessionsRepository.create({
      userId,
      platform: deviceInfo?.platform ?? Platform.WEB,
      deviceId: deviceInfo?.deviceId ?? null,
      deviceName: deviceInfo?.deviceName ?? parsed.deviceName ?? null,
      appVersion: deviceInfo?.appVersion ?? null,
      osVersion: deviceInfo?.osVersion ?? parsed.osVersion ?? null,
      userAgent: userAgent ?? deviceInfo?.userAgent ?? null,
      ipAddress: ipAddress ?? null,
      lastUsedAt: new Date(),
      isRevoked: false,
    });

    await this.invalidateCache(userId);
    return session;
  }

  async getSessions(userId: string): Promise<SessionResponseDto[]> {
    const cacheKey = this.getCacheKey(userId);
    if (this.redis) {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as SessionResponseDto[];
      }
    }

    const sessions = await this.sessionsRepository.findByUserId(userId);
    const result = sessions.map((session) => this.toResponseDto(session));

    if (this.redis) {
      await this.redis.set(
        cacheKey,
        JSON.stringify(result),
        'EX',
        APP_CONSTANTS.SESSION_CACHE_TTL,
      );
    }

    return result;
  }

  async validateSession(sessionId: string): Promise<Session> {
    const session = await this.sessionsRepository.findById(sessionId);
    if (!session || session.isRevoked) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.sessionsRepository.findById(sessionId);
    if (session?.userId !== userId) {
      throw new NotFoundException('Session not found');
    }
    await this.sessionsRepository.revoke(sessionId);
    await this.invalidateCache(userId);
  }

  async revokeAll(userId: string): Promise<void> {
    await this.sessionsRepository.revokeAll(userId);
    await this.invalidateCache(userId);
  }

  async revokeOthers(userId: string, currentSessionId: string): Promise<void> {
    await this.sessionsRepository.revokeOthers(userId, currentSessionId);
    await this.invalidateCache(userId);
  }

  async touch(sessionId: string): Promise<void> {
    await this.sessionsRepository.update(sessionId, { lastUsedAt: new Date() });
  }

  private toResponseDto(session: Session): SessionResponseDto {
    return {
      id: session.id,
      platform: session.platform,
      deviceId: session.deviceId,
      deviceName: session.deviceName,
      appVersion: session.appVersion,
      osVersion: session.osVersion,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      lastUsedAt: session.lastUsedAt,
      createdAt: session.createdAt,
      isRevoked: session.isRevoked,
    };
  }

  private getCacheKey(userId: string): string {
    return `sessions:${userId}`;
  }

  private async invalidateCache(userId: string): Promise<void> {
    if (this.redis) {
      await this.redis.del(this.getCacheKey(userId));
    }
  }
}
