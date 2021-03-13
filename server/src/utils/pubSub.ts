import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RedisOptions } from 'ioredis';

/** Redis pubSub from `graphql-redis-subscriptions` */
export const pubSub = new RedisPubSub({
  connection: process.env.REDIS_URL as RedisOptions
  // {
  //   retryStrategy: (options) => {
  //     // reconnect after upto 3000 milis
  //     return Math.max(options * 100, 3000);
  //   }
  // }
});
