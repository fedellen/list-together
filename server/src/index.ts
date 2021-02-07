import 'reflect-metadata';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createSchema } from './utils/createSchema';
import { redis } from './redis';
import http from 'http';
import { FRONT_END_URL, __prod__ } from './constants';
import router from './controllers/router';

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
    // dropSchema: true,
    // synchronize: true,
    migrations: ['dist/migration/*.js'],
    entities: ['dist/entities/**/*.js']
  });

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res, connection }: any) => ({ req, res, connection }),
    subscriptions: {
      onConnect: (_, ws: any) => {
        return new Promise((res) =>
          sessionMiddleware(ws.upgradeReq, {} as any, () => {
            res({ req: ws.upgradeReq });
          })
        );
      }
    }
  });
  const app = express();

  const RedisStore = connectRedis(session);

  const sessionMiddleware = session({
    store: new RedisStore({
      client: redis
    }),
    name: process.env.COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: __prod__, // production ? true : false
      maxAge: 1000 * 60 * 60 * 24 * 15 * 365, // 15 years
      sameSite: 'strict'
    }
  });

  app.use(sessionMiddleware);

  // app.set('trust proxy', 1);
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [FRONT_END_URL],
      credentials: true
    }
  });
  app.use('/confirm', router);

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  // ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
  httpServer.listen(parseInt(process.env.PORT), () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`
    );
  });

  //   // apolloServer.subscriptionsPath
  //   app.listen(parseInt(process.env.PORT), () =>
  //     console.log(
  //       `Server started on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  //     )
  //   );
  // };
};
main().catch((err) => console.log(err));
