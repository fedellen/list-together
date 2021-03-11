declare namespace NodeJS {
  export interface ProcessEnv {
    SESSION_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    COOKIE_NAME: string;
    BACKEND_URL: string;
    FRONT_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    TWITTER_API_KEY: string;
    TWITTER_API_SECRET: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
  }
}
