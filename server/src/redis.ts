import Redis from 'ioredis';

/** Redis Client */
export const redis = new Redis(process.env.REDIS_URL);
