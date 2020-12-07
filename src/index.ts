import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';

// Temporarily fixes a type error from @types/express-session update
declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

import {
  UserResolver,
  HelloResolver,
  ListResolver,
  ItemResolver
} from './resolvers';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, ListResolver, ItemResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req })
  });
  const app = express();

  const RedisStore = connectRedis(session);
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000'
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      name: 'oatmeal-raisen',
      secret: 'pants-are-fire',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 15 * 365 // 15 years
      }
    })
  );

  apolloServer.applyMiddleware({ app });
  app.listen(5000, () =>
    console.log(
      `Server started on http://localhost:5000${apolloServer.graphqlPath}`
    )
  );
};

main().catch((err) => console.log(err));
