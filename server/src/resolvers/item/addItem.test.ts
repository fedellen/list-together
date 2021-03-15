import faker from 'faker';
import { sleep } from '../../test-helpers/sleep';
import { UserToList } from '../../entities';
import {
  createUserWithSharedPriv,
  userWithList
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListFragment } from '../../test-helpers/fragments/userListFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const addItemMutation = `
mutation AddItem($data: AddItemInput!) {
  addItem(data: $data) {
    ${userListFragment} 
    ${fieldErrorFragment}
  }
}
`;

describe('Add item mutation:', () => {
  it('Owner of list can add items to the list', async () => {
    jest.setTimeout(10000);

    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });
    const itemName = faker.name.jobDescriptor();

    const response = await graphqlCall({
      source: addItemMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          nameInput: [itemName]
        }
      },
      userId: user.id
    });

    // Check response format and shape
    expect(response).toMatchObject({
      data: {
        addItem: {
          userToList: [
            {
              // Response has correct sortedItems
              sortedItems: [itemName],
              list: {
                items: [
                  {
                    // Response has new item
                    name: itemName
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
      relations: ['list', 'list.items', 'itemHistory']
    });

    // Item is on list in database with default attributes
    expect(listConnectionInDatabase!.list.items).toMatchObject([
      {
        name: itemName,
        strike: false,
        notes: null
      }
    ]);

    // Item is in sortedItems Array
    expect(listConnectionInDatabase!.sortedItems).toMatchObject([itemName]);

    // Item history correctly records the new item
    expect(listConnectionInDatabase!.itemHistory).toMatchObject([
      {
        item: itemName,
        timesAdded: 1,
        removalRatingArray: null
      }
    ]);

    // Item on recently added items
    expect(listConnectionInDatabase!.recentlyAddedItems).toMatchObject([
      itemName
    ]);

    // Wait 5.5 seconds for `recentlyAddedCallback` to resolve
    await sleep(5500);
    const listConnectionInDatabaseAfterSleep = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
    // Recently added items are to be removed after 5 seconds in dev/test
    expect(listConnectionInDatabaseAfterSleep!.recentlyAddedItems?.length).toBe(
      0
    );
  });

  it('User who has shared `add` privilege can add item', async () => {
    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });

    const { listId } = userToListTable!;

    const sharedUser = await createUserWithSharedPriv(listId, 'add');
    const itemName = faker.name.jobDescriptor();

    const response = await graphqlCall({
      source: addItemMutation,
      variableValues: {
        data: {
          listId: listId,
          nameInput: [itemName]
        }
      },
      userId: sharedUser.id
    });

    // No errors, response has item
    expect(response?.data?.addItem.errors).toBeNull();
    expect(response?.data?.addItem.userToList[0].list.items[0].name).toBe(
      itemName
    );

    // On shared user's sortedItems
    const sharedUserListConnectionInDatabase = await UserToList.findOne({
      where: { userId: sharedUser.id }
    });
    expect(sharedUserListConnectionInDatabase?.sortedItems).toMatchObject([
      itemName
    ]);

    // Wait 1 second before grabbing list for `addToSharedLists` to resolve
    await sleep(1000);
    const ownerListConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id }
    });

    // On owner's sortedItems
    expect(ownerListConnectionInDatabase?.sortedItems).toMatchObject([
      itemName
    ]);
  });

  it('User with list access without `add` privileges cannot add item', async () => {
    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });

    const { listId } = userToListTable!;

    // Shared user with read-only access
    const sharedUser = await createUserWithSharedPriv(listId, 'read');
    const itemName = faker.name.jobDescriptor();

    const response = await graphqlCall({
      source: addItemMutation,
      variableValues: {
        data: {
          listId: listId,
          nameInput: [itemName]
        }
      },
      userId: sharedUser.id
    });

    expect(response?.data?.addItem.errors[0].message).toBe(
      'User does not have the correct "add" privilege..'
    );

    // List in database still has no items, is nulled
    const ownerListConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });
    expect(ownerListConnectionInDatabase?.list.items?.length).toBe(0);
  });

  it('Add Item gives unauthorized response with no userId in context', async () => {
    await userWithList(); // Creates one list in database

    const allUserLists = await UserToList.find({});
    const itemName = faker.name.jobDescriptor();

    // Unauthorized client sending request to list
    const response = await graphqlCall({
      source: addItemMutation,
      variableValues: {
        data: {
          listId: allUserLists[0].listId,
          nameInput: [itemName]
        }
      },
      userId: undefined
    });

    expect(response).toMatchObject({
      data: {
        addItem: {
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
