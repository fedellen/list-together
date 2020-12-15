// import { logger } from '../middleware/logger';
import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers';
import { ListResolver } from '../resolvers';
import { ItemResolver } from '../resolvers';

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver, ListResolver, ItemResolver],
    // globalMiddlewares: [logger],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });
