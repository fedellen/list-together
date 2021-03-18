import faker from 'faker';
import { UserToList } from '../../entities';
import { createUser, userWithList } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListFragment } from '../../test-helpers/fragments/userListFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const createListMutation = `
mutation CreateList($title: String!) {
  createList (title: $title) {
    ${userListFragment}
    user {
      id
      sortedListsArray
    }
    ${fieldErrorFragment}
  }
}
`;

describe('Create list mutation:', () => {
  it('User with authenticated userId context can create a list', async () => {
    const userId = (await createUser()).id; // Creates user with no lists
    const title = faker.name.firstName();

    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: title },
      userId: userId
    });

    expect(response).toMatchObject({
      data: {
        createList: {
          userToList: {
            list: {
              title: title
            }
          },
          user: {
            sortedListsArray: [response.data?.createList.userToList.listId],
            id: userId
          }
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

  it('User cannot create more than 15 lists as owner', async () => {
    const user = await userWithList(15); // creates user with 15 lists
    const title = faker.name.firstName();

    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: title },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        createList: {
          errors: [
            {
              field: 'lists',
              message: 'User cannot create more than 15 lists..'
            }
          ]
        }
      }
    });

    const listConnectionsInDatabase = await UserToList.find({
      where: { userId: user.id }
    });

    expect(listConnectionsInDatabase).toHaveLength(15);
  });

  it('Unauthorized response with no userId in context', async () => {
    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: faker.name.title() }
    });

    expect(response).toMatchObject({
      data: {
        createList: {
          errors: [
            {
              field: 'context',
              message: 'Context contains no userId..'
            }
          ]
        }
      }
    });
  });
});
