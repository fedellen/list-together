import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';

// import cors from 'cors';
// import express from 'express';

// Import postgres models --
import { User } from './entities/User';
import { List } from './entities/List';
import { UserToList } from './entities/UserToList';
import { Item } from './entities/Item';
import { ItemHistory } from './entities/ItemHistory';
import { buildSchema } from 'type-graphql';

// import { ApolloServer } from 'apollo-server-express';

const main = async () => {
  // const connection = await createConnection();

  // const app = express();
  // app.use(cors());

  // const apolloServer = new ApolloServer({});

  // apolloServer.applyMiddleware({
  //   app,
  //   path: '/graphql'
  // });

  const connection = await createConnection();

  // console.log('Inserting a new user into the database...');

  // // Create a user
  // const user = new User();
  // user.password = 'password';
  // user.email = 'fedellen@pixelpajamastudios.com';
  // await connection.manager
  //   .save(user)
  //   .catch((e) => console.log('my console log:', e.message));
  // console.log('Saved a new user with id: ' + user.id);

  //

  // userId example: 604ff512-052f-4e21-899f-219916a3f029
  // listId example: 19a10a02-c664-4a57-adf1-cb6c175ad07f

  // // Add a list
  // const list = new List();
  // list.title = 'my-list';
  // await connection.manager.save(list);

  // // Create user to list connection
  // const userToList = new UserToList();
  // userToList.privileges = ['owner'];
  // userToList.listId = '19a10a02-c664-4a57-adf1-cb6c175ad07f';
  // userToList.userId = '604ff512-052f-4e21-899f-219916a3f029';
  // await connection.manager.save(userToList);

  // Create an item
  const listRepository = getRepository(List);

  const list = await listRepository.findOne({
    where: { id: '19a10a02-c664-4a57-adf1-cb6c175ad07f' },
    relations: ['items', 'itemHistory']
  });

  // if (!list) return console.log('Could not find list..')

  if (list !== undefined) {
    const newItem = new Item();
    newItem.name = 'nacho cheese sauce';
    newItem.order = 1;

    if (list.items) {
      // Check if item is already on the list
      const itemExists = list.items.find(({ name }) => name === newItem.name);

      itemExists
        ? // Scroll to the existing item in front end with `itemExists` const
          console.log('Item already exists..', itemExists)
        : (list.items = [...list.items, newItem]);
    } else {
      // Initialize an empty list with it's first item
      list.items = [newItem];
    }

    if (list.itemHistory) {
      const existingItemHistory = list.itemHistory.find(
        ({ item }) => item === newItem.name
      );

      if (existingItemHistory) {
        existingItemHistory.timesAdded = existingItemHistory.timesAdded + 1;
      } else {
        const newItemHistory = new ItemHistory();
        newItemHistory.item = newItem.name;
        list.itemHistory = [...list.itemHistory, newItemHistory];
      }
    } else {
      const newItemHistory = new ItemHistory();
      newItemHistory.item = newItem.name;
      list.itemHistory = [newItemHistory];
    }

    //   // Does ItemHistory exist?
    //   // Does Item exist on History?
    //   // Increment timesAdded else create new Item History

    await listRepository.save(list);

    console.log(list);
  }

  // console.log('Loading users from the database...');
  // const users = await connection.manager.find(User);
  // console.log('Loaded users: ', users);

  // console.log('Loading listConnections from the database...');
  // const listConnections = await connection.manager.find(UserToList);
  // console.log('Loaded listConnections: ', listConnections);
};

main().catch((error) =>
  console.error(`Full Error: ${error}, Message: ${error.message}`)
);
