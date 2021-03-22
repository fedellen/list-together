import { userFragment } from '../../test-helpers/fragments/userFragment';
import { UserToList, List } from '../../entities';
import {
  userWithListAndItems,
  userWithList,
  createUserWithSharedPriv
} from '../../test-helpers/createUser';
import { graphqlCall } from '../../test-helpers/graphqlCall';
import { sleep } from '../../test-helpers/sleep';

const deleteListMutation = `
  mutation DeleteList($listId: String!) {
    deleteList(listId: $listId) 
      ${userFragment}
  }
`;

describe('Delete list mutation:', () => {
  it('User can delete their UserToList connection, list is deleted when no other connections exist', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });

    const response = await graphqlCall({
      source: deleteListMutation,
      variableValues: { listId: userToListTable!.listId },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteList: {
          user: {
            id: user.id
          }
        }
      }
    });
    expect(
      response.data?.deleteList.user.sortedListsArray.includes(
        userToListTable?.listId
      )
    ).toBe(false);

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter).toBeUndefined();

    // List no longer exists
    const listInDatabaseAfter = await List.findOne(userToListTable!.listId);
    expect(listInDatabaseAfter).toBeUndefined();
  });

  it('List infers a new owner when owner of list deletes connection and list has existing connections', async () => {
    const listOwner = await userWithList();
    const ownersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const listId = ownersUserToListTable!.listId;
    const sharedUser = await createUserWithSharedPriv(
      listId,

      'delete'
    );

    const response = await graphqlCall({
      source: deleteListMutation,
      variableValues: { listId: listId },
      userId: listOwner.id
    });

    expect(response).toMatchObject({
      data: {
        deleteList: {
          user: {
            id: listOwner.id
          }
        }
      }
    });
    expect(
      response.data?.deleteList.user.sortedListsArray.includes(
        ownersUserToListTable?.listId
      )
    ).toBe(false);

    await sleep(100); // Wait 100ms for server to `resolveListOwnership`
    const sharedUserToListTableAfter = await UserToList.findOne({
      where: { userId: sharedUser.id }
    });

    // List has new owner
    expect(sharedUserToListTableAfter).toMatchObject({
      privileges: 'owner'
    });
  });

  it('Delete list cannot be used by unauthenticated requests', async () => {
    // User must have authenticated context to target a list connection
    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });
    const listId = userToListTable!.listId;

    const response = await graphqlCall({
      source: deleteListMutation,
      variableValues: { listId: listId },
      userId: undefined
    });

    expect(response).toMatchObject({
      data: {
        deleteList: {
          errors: [
            {
              field: 'context',
              message: 'Context contains no userId..'
            }
          ]
        }
      }
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter).toBeDefined();
  });
});
