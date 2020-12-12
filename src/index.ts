import 'reflect-metadata';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
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

import { COOKIE_NAME } from './constants';
import { createSchema } from './utils/createSchema';

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res })
  });
  const app = express();

  const RedisStore = connectRedis(session);
  app.use(cors<express.Request>());
  app.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      name: COOKIE_NAME,
      secret: process.env.SESSION_SECRET!,
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
