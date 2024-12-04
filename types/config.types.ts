export type ConfigType = Record<
  | 'DATABASE_URL'
  | 'JWT_SECRET'
  | 'FRONT_END_URL'
  | 'MAILER_HOST'
  | 'MAILER_USERNAME'
  | 'MAILER_PASSWORD'
  | 'REDIS_STORE'
  | 'MAILER_FROM',
  string
>;
