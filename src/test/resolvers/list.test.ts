import 'reflect-metadata';
import { Connection } from 'typeorm';
import { graphqlCall } from '../helpers/graphqlCall';
import { testConn } from '../helpers/testConn';
import { redis } from '../../redis';
import faker from 'faker';
// import { createConfirmationUrl } from '../../utils/confirmationUrl';
import { createUser, userWithList } from '../helpers/createUser';
import { UserToList } from '../../entities';
// import { v4 } from 'uuid';
// import { forgetPasswordPrefix } from '../../constants';

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

const getUsersListsQuery = `
query GetUsersLists {
  getUsersLists
  {
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

const createListMutation = `
mutation CreateList($title: String!) {
  createList (title: $title) {
    title
    id
  }
}
`;

describe('Get users lists query:', () => {
  it('Fetches all the current users lists', async () => {
    const user = await userWithList();

    const response = await graphqlCall({
      source: getUsersListsQuery,
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        getUsersLists: [
          {
            list: {
              title: 'my-test-list-0'
            }
          }
        ]
      }
    });
  });

  it('Unauthorized response with no userId in context', async () => {
    const response = await graphqlCall({
      source: getUsersListsQuery
    });

    expect(response).toMatchObject({
      errors: [
        {
          message: 'Not authenticated..'
        }
      ]
    });
  });
});

describe('Create list mutation:', () => {
  it('User with authenticated userId context can create a list', async () => {
    const userId = (await createUser()).id; // Creates user with no lists
    const title = faker.name.title();

    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: title },
      userId: userId
    });

    expect(response).toMatchObject({
      data: {
        createList: {
          title: title
        }
      }
    });

    const listConnectionsInDatabase = await UserToList.find({
      where: { userId: userId }
    });

    // User will now have one list connection in the database
    expect(listConnectionsInDatabase).toBeDefined();
    expect(listConnectionsInDatabase).toHaveLength(1);
  });

  it('User cannot create more than 25 lists as owner', async () => {
    const user = await userWithList(25); // creates user with 25 lists
    const title = faker.name.title();

    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: title },
      userId: user.id
    });

    expect(response).toMatchObject({
      errors: [
        {
          message: 'User cannot create more than 25 lists..'
        }
      ]
    });

    const listConnectionsInDatabase = await UserToList.find({
      where: { userId: user.id }
    });

    expect(listConnectionsInDatabase).toHaveLength(25);
  });

  it('Unauthorized response with no userId in context', async () => {
    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: faker.name.title() }
    });

    expect(response).toMatchObject({
      errors: [
        {
          message: 'Not authenticated..'
        }
      ]
    });
  });
});

// describe('Share list mutation:', () => {
//   it('Owner of the list can share the list', () => {});

//   it('Non-owners cannot share the list', () => {});
// });

// describe('Delete list mutation:', () => {
//   it('Owner of the list can delete the list', () => {});

//   it('Non-owners cannot delete the list', () => {});
// });

// describe('Rename list mutation:', () => {
//   it('Owner of list can rename the list', () => {});

//   it('Non-owners cannot rename the list', () => {});
// });

// describe('Sort list mutation:', () => {
//   it('User can sort the order of in which their lists are displayed', () => {});

//   it('Non-owners cannot rename the list', () => {});
// });

// describe('Re-order list mutation:', () => {
//   it('User can submit a re-ordered list', () => {});

//   it('User can automatically re-order the list', () => {});

//   it('When user recieves a list with new items, the new items are presented at the top of their Sorted List', () => {});
// });
