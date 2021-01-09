import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers';
import { ListResolver } from '../resolvers';
import { ItemResolver } from '../resolvers';

/** Redis PubSub */
import { pubSub } from './pubSub';

// /** ApolloServer PubSub */
// import { PubSub } from 'apollo-server-express';
// const pubSub = new PubSub();

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver, ListResolver, ItemResolver],
    validate: false,
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
    pubSub
  });
