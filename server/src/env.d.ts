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
    BACKEND_PROD_URL: string;
    BACKEND_DEV_URL: string;
    FRONT_PROD_URL: string;
    FRONT_DEV_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    TWITTER_API_KEY: string;
    TWITTER_API_SECRET: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
  }
}
