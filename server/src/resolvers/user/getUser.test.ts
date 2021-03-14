import { userWithList } from '../../test-helpers/createUser';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const getUserQuery = `
query GetUser {
  getUser {
    id
    sortedListsArray
  }
}
`;

describe('Get user query:', () => {
  it('Fetches all the current users lists', async () => {
    const user = await userWithList();

    const response = await graphqlCall({
      source: getUserQuery,
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        getUser: {
          id: user.id
        }
      }
    });

    expect(response?.data?.getUser.id).toBeDefined();
    expect(response?.data?.getUser.sortedListsArray).toHaveLength(1);
  });
});
