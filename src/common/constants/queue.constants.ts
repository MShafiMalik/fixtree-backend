export const QUEUES = {
  NOTIFICATIONS: 'notifications',
  CRON: 'cron',
} as const;

export const NOTIFICATION_JOBS = {
  // Email jobs
  WELCOME_EMAIL: 'welcome-email',
  PASSWORD_RESET_EMAIL: 'password-reset-email',
  EMAIL_VERIFICATION: 'email-verification',

  // SMS jobs
  WELCOME_SMS: 'welcome-sms',
  BOOKING_CONFIRMATION_SMS: 'booking-confirmation-sms',
  BOOKING_REMINDER_SMS: 'booking-reminder-sms',
} as const;

export const CRON_JOBS = {
  CLEANUP_EXPIRED_SESSIONS: 'cleanup-expired-sessions',
  DAILY_REPORT: 'daily-report',
} as const;
