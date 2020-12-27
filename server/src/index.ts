import 'reflect-metadata';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createSchema } from './utils/createSchema';
import { redis } from './redis';

// Temporarily fixes a type error from @types/express-session update
declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

const main = async () => {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    migrations: ['dist/migration/*.js'],
    entities: ['dist/entities/**/*.js']
  });

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res })
  });
  const app = express();

  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      name: process.env.COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 15 * 365, // 15 years
        sameSite: 'strict'
      }
    })
  );

  // app.set('trust proxy', 1);
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://localhost:3000',
        'http://192.168.86.136:8080'
      ],
      credentials: true
    }
  });
  app.listen(parseInt(process.env.PORT), () =>
    console.log(
      `Server started on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    )
  );
};

main().catch((err) => console.log(err));
