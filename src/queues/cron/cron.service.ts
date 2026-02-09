import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES, CRON_JOBS } from '../../common/constants/queue.constants';
import { APP_CONSTANTS } from '../../common/constants/app.constants';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(@InjectQueue(QUEUES.CRON) private readonly cronQueue: Queue) {}

  async onModuleInit() {
    await this.scheduleJobs().catch((error: unknown) => {
      this.logger.error('Error scheduling cron jobs', error);
    });
  }

  private async scheduleJobs(): Promise<void> {
    // Cleanup expired sessions - runs daily at midnight (00:00)
    await this.cronQueue.add(
      CRON_JOBS.CLEANUP_EXPIRED_SESSIONS,
      {},
      {
        repeat: {
          pattern: APP_CONSTANTS.CLEANUP_EXPIRED_SESSIONS_CRON_PATTERN,
        },
        removeOnComplete: {
          age: APP_CONSTANTS.COMPLETED_JOB_RETENTION_AGE_SECONDS,
          count: APP_CONSTANTS.COMPLETED_JOB_RETENTION_COUNT,
        },
        removeOnFail: {
          age: APP_CONSTANTS.FAILED_JOB_RETENTION_AGE_SECONDS,
        },
      },
    );

    this.logger.log('Cron jobs scheduled successfully');
  }
}
