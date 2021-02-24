import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers';
import { ListResolver } from '../resolvers';
import { ItemResolver } from '../resolvers';
import { AddItemResolver } from '../resolvers/item/addItem';
import { DeleteItemsResolver } from '../resolvers/item/deleteItems';
import { StrikeItemResolver } from '../resolvers/item/strikeItem';

// Redis PubSub
import { pubSub } from './pubSub';

// // ApolloServer PubSub
// import { PubSub } from 'apollo-server-express';
// const pubSub = new PubSub();

export const createSchema = () =>
  buildSchema({
    resolvers: [
      UserResolver,
      ListResolver,
      ItemResolver,
      AddItemResolver,
      DeleteItemsResolver,
      StrikeItemResolver
    ],
    validate: false,
    pubSub
  });
