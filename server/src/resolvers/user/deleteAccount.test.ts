import { List, User, UserToList } from '../../entities';
import {
  createUserWithSharedPriv,
  userWithList
} from '../../test-helpers/createUser';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const deleteAccountMutation = `
mutation DeleteAccount {
  deleteAccount
}
`;

describe('Delete account mutation:', () => {
  it('Deletes the users account, and deletes/resolves list tables', async () => {
    // User with 3 lists
    const user = await userWithList(3);
    const usersListTables = await UserToList.find({
      where: { userId: user.id }
    });

    const listIdArray = usersListTables.map((userList) => userList.listId);

    // Share listIdArray[0]
    const sharedUser = await createUserWithSharedPriv(listIdArray[0], 'strike');

    const sharedUserTableBefore = await UserToList.findOne({
      where: { userId: sharedUser.id }
    });
    expect(sharedUserTableBefore?.privileges).toBe('strike');

    const response = await graphqlCall({
      source: deleteAccountMutation,
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteAccount: true
      }
    });

    const userInDatabase = await User.findOne({ where: { id: user.id } });
    expect(userInDatabase).toBeUndefined();

    const usersListTablesInDatabase = await UserToList.find({
      where: { userId: user.id }
    });
    expect(usersListTablesInDatabase.length).toBe(0);

    // Check List tables in Database
    const listTableZero = await List.findOne({ where: { id: listIdArray[0] } });
    expect(listTableZero).toBeDefined();
    const listTableOne = await List.findOne({ where: { id: listIdArray[1] } });
    expect(listTableOne).toBeUndefined();
    const listTableTwo = await List.findOne({ where: { id: listIdArray[2] } });
    expect(listTableTwo).toBeUndefined();

    // Shared user to list table resolves new ownership
    const sharedUserTableInDatabase = await UserToList.findOne({
      where: { userId: sharedUser.id }
    });
    expect(sharedUserTableInDatabase?.privileges).toBe('owner');
  });
});
