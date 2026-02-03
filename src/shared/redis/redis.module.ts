import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        const host = configService.getOrThrow<string>('redis.host');
        const port = configService.getOrThrow<number>('redis.port');
        const password = configService.get<string>('redis.password');
        const logger = new Logger('Redis');

        const client = new Redis({
          host,
          port,
          password: password ?? undefined,
          // Fail fast: no infinite retries if Redis is down
          enableOfflineQueue: false,
          maxRetriesPerRequest: 1,
          retryStrategy: () => null,
        });

        client.on('ready', () => {
          logger.log(`Connected to Redis at ${host}:${String(port)}`);
        });
        client.on('error', (error) => {
          logger.error(
            `Redis error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        });
        client.on('end', () => {
          logger.warn('Redis connection closed');
        });

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
