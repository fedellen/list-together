declare namespace NodeJS {
  export interface ProcessEnv {
    EMAIL_URL: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    SESSION_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    COOKIE_NAME: string;
    FRONT_PROD_URL: string;
    FRONT_DEV_URL: string;
  }
}
