import { sleep } from '../../test-helpers/sleep';
import { UserToList } from '../../entities';
import {
  userWithListAndItems,
  createUserWithSharedPriv
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListFragment } from '../../test-helpers/fragments/userListFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const deleteItemsMutation = `
mutation DeleteItems($data: DeleteItemsInput!) {
  deleteItems(data: $data) {
    ${userListFragment} 
    ${fieldErrorFragment}
  }
}
`;

describe('Delete items mutation:', () => {
  it('User can delete items from their own list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);

    // Set sorted items array for testing
    userToListTable!.sortedItems = itemNameArray;
    await userToListTable!.save();

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemNameArray: [itemNameArray[0], itemNameArray[1]]
        }
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: null,
          userToList: [
            {
              list: {
                items: [
                  {
                    name: itemNameArray[2]
                  },
                  {
                    name: itemNameArray[3]
                  },
                  {
                    name: itemNameArray[4]
                  }
                ]
              }
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    // List array without [0] and [1]
    expect(listConnectionInDatabase!.list.items![0].name).toBe(
      itemNameArray[2]
    );
    expect(listConnectionInDatabase!.list.items![1].name).toBe(
      itemNameArray[3]
    );
    expect(listConnectionInDatabase!.list.items![2].name).toBe(
      itemNameArray[4]
    );

    // Check sorted items array
    expect(listConnectionInDatabase!.sortedItems![0]).toBe(itemNameArray[2]);
    expect(listConnectionInDatabase!.sortedItems![1]).toBe(itemNameArray[3]);
    expect(listConnectionInDatabase!.sortedItems![2]).toBe(itemNameArray[4]);
  });

  it('Non-existing item conflicts are handled in backend, still deletes remaining items from request', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);

    // Set sorted items array for testing
    userToListTable!.sortedItems = itemNameArray;
    await userToListTable!.save();

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemNameArray: ['fakeItemName', itemNameArray[0], itemNameArray[1]]
        }
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: [
            {
              field: 'itemName',
              message: 'Item "fakeItemName" was not found on the list..'
            }
          ],
          userToList: [
            {
              list: {
                items: [
                  {
                    name: itemNameArray[2]
                  },
                  {
                    name: itemNameArray[3]
                  },
                  {
                    name: itemNameArray[4]
                  }
                ]
              }
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    // List array without [0] and [1]
    expect(listConnectionInDatabase!.list.items![0].name).toBe(
      itemNameArray[2]
    );
    expect(listConnectionInDatabase!.list.items![1].name).toBe(
      itemNameArray[3]
    );
    expect(listConnectionInDatabase!.list.items![2].name).toBe(
      itemNameArray[4]
    );
  });

  it('User with shared `delete` privileges can delete items from list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      'delete'
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemNameArray: [itemNameArray[2], itemNameArray[3], itemNameArray[4]]
        }
      },
      userId: sharedUser.id
    });

    // Check response format
    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: null,
          userToList: [
            {
              // sortedItems removed
              sortedItems: [itemNameArray[1], itemNameArray[0]],
              list: {
                // Items removed
                items: [
                  {
                    name: itemNameArray[0]
                  },
                  {
                    name: itemNameArray[1]
                  }
                ]
              }
            }
          ]
        }
      }
    });

    // Wait 1 second for `removeFromSharedLists` to resolve
    await sleep(1000);
    const ownerListConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    expect(ownerListConnectionInDatabase!.sortedItems!.length).toBe(2);
  });

  it('User without shared `delete` privileges cannot delete items from list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      'strike'
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemNameArray: [itemNameArray[3]]
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has item name
    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: [
            {
              field: 'privileges',
              message: 'User does not have the correct "delete" privilege..'
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    // List array without [0] and [1]
    expect(listConnectionInDatabase!.list.items![0].name).toBe(
      itemNameArray[0]
    );
    expect(listConnectionInDatabase!.list.items![1].name).toBe(
      itemNameArray[1]
    );
    expect(listConnectionInDatabase!.list.items![2].name).toBe(
      itemNameArray[2]
    );
    expect(listConnectionInDatabase!.list.items![3].name).toBe(
      itemNameArray[3]
    );
    expect(listConnectionInDatabase!.list.items![4].name).toBe(
      itemNameArray[4]
    );
  });
});
