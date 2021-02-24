import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers';
import { ListResolver } from '../resolvers';
import { AddItemResolver } from '../resolvers/item/addItem';
import { DeleteItemsResolver } from '../resolvers/item/deleteItems';
import { StrikeItemResolver } from '../resolvers/item/strikeItem';
import { AddNoteResolver } from '../resolvers/item/addNote';
import { DeleteNoteResolver } from '../resolvers/item/deleteNote';

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
      AddItemResolver,
      DeleteItemsResolver,
      StrikeItemResolver,
      AddNoteResolver,
      DeleteNoteResolver
    ],
    validate: false,
    pubSub
  });
