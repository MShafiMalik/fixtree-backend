export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Password
  SALT_ROUNDS: 10,

  // Token
  BEARER_PREFIX: 'Bearer',

  // Headers
  REQUEST_ID_HEADER: 'X-Request-ID',
  AUTHORIZATION_HEADER: 'Authorization',

  // Session
  MAX_SESSIONS_PER_USER: 5,
  SESSION_CACHE_TTL: 3600, // 1 hour in seconds
  SESSION_EXPIRY_DAYS: 30, // Sessions older than 30 days will be cleaned up

  // Verification
  VERIFICATION_COOLDOWN_MINUTES: 1,

  // Queue/Cron Jobs
  COMPLETED_JOB_RETENTION_AGE_SECONDS: 86400, // 24 hours in seconds
  COMPLETED_JOB_RETENTION_COUNT: 100,
  FAILED_JOB_RETENTION_AGE_SECONDS: 604800, // 7 days in seconds
  CLEANUP_EXPIRED_SESSIONS_CRON_PATTERN: '0 0 * * *', // Daily at 00:00 (midnight)
};
