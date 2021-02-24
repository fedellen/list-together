import { userWithList } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListFragment } from '../../test-helpers/fragments/userListFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const getUsersListsQuery = `
query GetUsersLists {
  getUsersLists {
    ${userListFragment}
    ${fieldErrorFragment}
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
        getUsersLists: {
          userToList: [
            {
              list: {
                title: 'my-test-list-0'
              }
            }
          ]
        }
      }
    });
  });

  it('Unauthorized response with no userId in context', async () => {
    const response = await graphqlCall({
      source: getUsersListsQuery
    });

    expect(response).toMatchObject({
      data: {
        getUsersLists: {
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
