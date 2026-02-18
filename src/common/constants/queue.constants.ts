export const QUEUES = {
  NOTIFICATIONS: 'notifications',
  CRON: 'cron',
} as const;

export const CRON_JOBS = {
  CLEANUP_EXPIRED_SESSIONS: 'cleanup-expired-sessions',
  DAILY_REPORT: 'daily-report',
} as const;
