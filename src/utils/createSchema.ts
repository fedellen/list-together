import { buildSchema } from 'type-graphql';
import { HelloResolver } from '../resolvers';
import { UserResolver } from '../resolvers';
import { ListResolver } from '../resolvers';
import { ItemResolver } from '../resolvers';

export const createSchema = () =>
  buildSchema({
    resolvers: [HelloResolver, UserResolver, ListResolver, ItemResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });
