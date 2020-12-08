import 'reflect-metadata';
// import { User } from '../../entities';
import { Connection } from 'typeorm';
import { graphqlCall } from '../graphqlCall';
import { testConn } from '../testConn';
import { redis } from '../../redis';
import faker from 'faker';

let conn: Connection;
beforeAll(async () => {
  // Create connections before all
  conn = await testConn();
  if (redis.status === 'end') await redis.connect();
});

beforeEach(async () => {
  // Clear DB before each
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

describe('createUser Resolver:', () => {
  it('create a user', async () => {
    // console.log('the users at start:', await User.find({}));

    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    console.log(user);

    const result = await graphqlCall({
      source: createUserMutation,
      variableValues: {
        data: user
      }
    });
    console.log(JSON.stringify(result, null, 4));
  });
});
