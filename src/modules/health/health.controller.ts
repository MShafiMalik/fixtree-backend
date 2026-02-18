import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  type HealthIndicatorResult,
} from '@nestjs/terminus';
import { REDIS_CLIENT } from '../../shared/redis/redis.constants';
import { Public } from '../../common/decorators/public.decorator';
import type Redis from 'ioredis';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckResponseDto } from './dto/health-check-response.dto';
import { DatabaseHealthResponseDto } from './dto/database-health-response.dto';
import { RedisHealthResponseDto } from './dto/redis-health-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get overall health status' })
  @ApiResponse({
    status: 200,
    description: 'Health check passed',
    type: HealthCheckResponseDto,
  })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.checkRedis(),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9, // 90% threshold
        }),
    ]);
  }

  @Public()
  @Get('db')
  @ApiOperation({ summary: 'Get database health status' })
  @ApiResponse({
    status: 200,
    description: 'Database health check passed',
    type: DatabaseHealthResponseDto,
  })
  @HealthCheck()
  checkDb() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Public()
  @Get('redis')
  @ApiOperation({ summary: 'Get Redis health status' })
  @ApiResponse({
    status: 200,
    description: 'Redis health check passed',
    type: RedisHealthResponseDto,
  })
  @HealthCheck()
  checkRedisEndpoint() {
    return this.health.check([() => this.checkRedis()]);
  }

  private async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      await this.redisClient.ping();
      return { redis: { status: 'up' } };
    } catch (error) {
      throw new Error(
        `Redis health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
