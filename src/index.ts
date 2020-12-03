import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

// import { Resolvers } from './schema/resolvers';

// Import postgres models --
import { User /*List, UserToList, Item, ItemHistory*/ } from './entities/index';
import { UserResolver } from './resolvers/user';
import { HelloResolver } from './resolvers/hello';
import { ListResolver } from './resolvers/list';
import { ItemResolver } from './resolvers/item';

const main = async () => {
  const connection = await createConnection();

  console.log('Loading users from the database...');
  const users = await connection.manager.find(User);
  console.log('Loaded users: ', users);

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, ListResolver, ItemResolver],
    validate: false
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
