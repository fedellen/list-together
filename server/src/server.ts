import 'reflect-metadata';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { createSchema } from './utils/createSchema';
import http from 'http';
import { FRONTEND_URL, __prod__ } from './constants';
import { sessionMiddleware } from './middleware/session';
import app from './app';

// Temporarily fixes a type error from @types/express-session update
declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

const server = async () => {
  // Create TypeORM connection
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // dropSchema: true,
    // synchronize: true,
    migrations: ['dist/migration/*.js'],
    entities: ['dist/entities/**/*.js']
  });

  // Create TypeGraphQL schema
  const schema = await createSchema();

  // Create Apollo Server
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res, connection }: any) => ({ req, res, connection }),
    subscriptions: {
      onConnect: (_, ws: any) => {
        return new Promise((res) =>
          // Use redis session auth on subscriptions
          sessionMiddleware(ws.upgradeReq, {} as any, () => {
            res({ req: ws.upgradeReq });
          })
        );
      }
    }
  });

  // Add express to Apollo, include cors with credentials for session auth
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [FRONTEND_URL],
      credentials: true
    }
  });

  // Handle subscriptions via http
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(parseInt(process.env.PORT), () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🔥 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`
    );
  });
};

// Run the server 👨🏿‍💻
server().catch((err) => console.log(err));
