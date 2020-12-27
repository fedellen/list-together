import Redis from 'ioredis';
import 'dotenv-safe/config';

export const redis = new Redis(process.env.REDIS_URL);
