import 'reflect-metadata';
import { User, UserToList } from '../../entities';
import { Connection } from 'typeorm';
import { graphqlCall } from '../helpers/graphqlCall';
import { testConn } from '../helpers/testConn';
import { redis } from '../../redis';
import faker from 'faker';
import { createConfirmationUrl } from '../../utils/confirmationUrl';
import { createUser } from '../helpers/createUser';
import { v4 } from 'uuid';

let conn: Connection;
beforeAll(async () => {
  // Create connections before all
  conn = await testConn();
  if (redis.status === 'end') await redis.connect();
});

beforeEach(async () => {
  // Clear DB before each test
  conn.entityMetadatas.forEach(async (entity) => {
    const repository = conn.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  });
});

afterAll(async () => {
  // Close connections
  await conn.close();
  redis.disconnect();
});

const createUserMutation = `
mutation CreateUser($data: CreateUserInput!) {
  createUser(
    data: $data
  ) {
    id
    username
    email
  }
}
`;

const confirmUserMutation = `
mutation ConfirmUser($token: String!) {
  confirmUser(
    token: $token
  ) 
}
`;

const loginUserMutation = `
mutation LoginUser($email: String!, $password: String!) {
  login(
    email: $email
    password: $password
  ) {
    userId
    listId
    privileges
    mostCommonWords
    autoSortedList
    itemHistory {
      item
      timesAdded
      removalOrder
    }
    list {
      title
      items {
        name
        notes
        strike
        bold
      }
    }
  }
}
`;

describe('createUser Mutation:', () => {
  it('can create a user with valid credentials', async () => {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const response = await graphqlCall({
      source: createUserMutation,
      variableValues: {
        data: user
      }
    });

    // Check response format
    expect(response).toMatchObject({
      data: {
        createUser: {
          username: user.username,
          email: user.email
        }
      }
    });

    // Check database entry
    const userInDatabase = await User.findOne({ where: { email: user.email } });
    expect(userInDatabase).toBeDefined();
    expect(userInDatabase!.confirmed).toBeFalsy();
    expect(userInDatabase!.email).toBe(user.email);

    console.log(await redis.get(userInDatabase!.id));
  });

  it('returns validation error with invalid email credentials', async () => {
    const user = {
      username: faker.internet.userName(),
      email: 'notAnEmailAddress.fake',
      password: faker.internet.password()
    };

    const response = await graphqlCall({
      source: createUserMutation,
      variableValues: {
        data: user
      }
    });

    // Check response format
    expect(response).toMatchObject({
      errors: [
        {
          message: 'Argument Validation Error'
        }
      ]
    });

    // Check for database entry
    const userInDatabase = await User.findOne({ where: { email: user.email } });
    expect(userInDatabase).toBeUndefined();
  });
});

describe('the confirmUser mutation:', () => {
  it('User can confirm account with the token created from the createConfirmationUrl function', async () => {
    const user = await createUser(false);
    expect(user.confirmed).toBeFalsy();
    const url = await createConfirmationUrl(user.id);
    const token = url.substr(url.length - 36);

    const response = await graphqlCall({
      source: confirmUserMutation,
      variableValues: {
        token: token
      }
    });

    expect(response).toMatchObject({
      data: {
        confirmUser: true
      }
    });

    // Refetch the user from database
    const userInDatabase = await User.findOne({ where: { id: user.id } });
    expect(userInDatabase!.confirmed).toBeTruthy();
  });

  it('User cannot confirm account with a fake uuid token', async () => {
    const user = await createUser(false);
    expect(user.confirmed).toBeFalsy();
    await createConfirmationUrl(user.id);
    // Create fake `uuid v4` token
    const token = v4();

    const response = await graphqlCall({
      source: confirmUserMutation,
      variableValues: {
        token: token
      }
    });

    expect(response).toMatchObject({
      data: {
        confirmUser: false
      }
    });

    // Refetch the user from database
    const userInDatabase = await User.findOne({ where: { id: user.id } });
    expect(userInDatabase!.confirmed).toBeFalsy();
  });
});

describe('login mutation:', () => {
  it('Confirmed user can login with the correct credentials, and receives fresh empty list upon first login', async () => {
    const user = await createUser();

    const usersLists = await UserToList.find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });

    // No list connections on fresh user
    expect(usersLists).toHaveLength(0);

    const response = await graphqlCall({
      source: loginUserMutation,
      variableValues: {
        email: user.email,
        password: user.password
      }
    });

    // New UserToList connection has 'my-list'
    expect(response).toMatchObject({
      data: {
        login: [
          {
            list: {
              title: 'my-list'
            }
          }
        ]
      }
    });
  });

  it('Confirmed user cannot login with incorrect credentials', async () => {
    const user = await createUser();
    const response = await graphqlCall({
      source: loginUserMutation,
      variableValues: {
        email: user.email,
        password: 'wrongPassword'
      }
    });

    // New UserToList connection has 'my-list'
    expect(response).toMatchObject({
      errors: [
        {
          message: 'Login has failed...'
        }
      ]
    });
  });
});
