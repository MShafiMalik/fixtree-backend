import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES, CRON_JOBS } from '../../common/constants/queue.constants';
import { SessionsRepository } from '../../modules/auth/sessions/sessions.repository';
import { APP_CONSTANTS } from '../../common/constants/app.constants';

@Processor(QUEUES.CRON)
export class CronProcessor extends WorkerHost {
  private readonly logger = new Logger(CronProcessor.name);

  constructor(private readonly sessionsRepository: SessionsRepository) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing cron job: ${job.name}`);

    switch (job.name) {
      case CRON_JOBS.CLEANUP_EXPIRED_SESSIONS:
        await this.cleanupExpiredSessions();
        break;
      default:
        this.logger.warn(`Unknown cron job: ${job.name}`);
    }
  }

  private async cleanupExpiredSessions(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() - APP_CONSTANTS.SESSION_EXPIRY_DAYS,
    );

    const result =
      await this.sessionsRepository.cleanupExpiredSessions(cutoffDate);

    const totalCleaned = result.revoked + result.expired;

    this.logger.log(
      `Cleaned up ${String(totalCleaned)} expired sessions (${String(result.revoked)} revoked, ${String(result.expired)} expired)`,
    );
  }
}
