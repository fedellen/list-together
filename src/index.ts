import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

// import { Resolvers } from './schema/resolvers';

import {
  UserResolver,
  HelloResolver,
  ListResolver,
  ItemResolver
} from './resolvers';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, ListResolver, ItemResolver]
  });

  const apolloServer = new ApolloServer({ schema });
  const app = express();
  apolloServer.applyMiddleware({ app });
  app.listen(5000, () =>
    console.log(
      `Server started on http://localhost:5000${apolloServer.graphqlPath}`
    )
  );
};

main().catch((err) => console.log(err));
