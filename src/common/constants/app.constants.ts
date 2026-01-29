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
};
