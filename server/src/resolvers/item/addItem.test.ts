import faker from 'faker';
import { UserToList } from '../../entities';
import { userWithList } from '../../test-helpers/createUser';
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

    // Check response format, has item name
    expect(response).toMatchObject({
      data: {
        addItem: {
          userToList: [
            {
              list: {
                items: [
                  {
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

    // Item history correctly records the new item
    expect(listConnectionInDatabase!.itemHistory).toMatchObject([
      {
        item: itemName,
        timesAdded: 1,
        removalRatingArray: null
      }
    ]);
  });

  // it('User who has shared `add` privilege can add item', () => {});

  // it('User with list access without `add` privileges cannot add item', () => {});

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
