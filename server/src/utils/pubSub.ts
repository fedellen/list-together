import { RedisPubSub } from 'graphql-redis-subscriptions';

export const pubSub = new RedisPubSub({
  connection: {
    retryStrategy: (options) => {
      // reconnect after upto 3000 milis
      return Math.max(options * 100, 3000);
    }
  }
});
