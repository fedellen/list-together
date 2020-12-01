import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import cors from 'cors';
import express from 'express';
// import { ApolloServer } from 'apollo-server-express';

const main = async () => {
  // const connection = await createConnection();

  const app = express();
  app.use(cors());

  // const apolloServer = new ApolloServer({});

  // apolloServer.applyMiddleware({
  //   app,
  //   path: '/graphql'
  // });

  createConnection()
    .then(async (connection) => {
      // console.log('Inserting a new user into the database...');
      // const user = new User();
      // user.password = 'password';
      // user.email = 'fedellen@pixelpajamastudios.com';
      // await connection.manager.save(user);
      // console.log('Saved a new user with id: ' + user.id);

      console.log('Loading users from the database...');
      const users = await connection.manager.find(User);
      console.log('Loaded users: ', users);

      //   console.log('Here you can setup and run express/koa/any other framework.');
    })
    .catch((error) => console.log(error));
};

main().catch((error) => console.error(error));
