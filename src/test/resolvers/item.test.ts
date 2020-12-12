import { graphqlCall } from '../helpers/graphqlCall';
import { userWithList } from '../helpers/createUser';
import { UserToList } from '../../entities';
import faker from 'faker';
import { userListFragment } from '../helpers/userListFragment';

export const addItemMutation = `
mutation AddItem($listId: String!, $name: String!) {
  addItem(listId: $listId, name: $name) ${userListFragment}
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
        listId: userToListTable!.listId,
        name: itemName
      },
      userId: user.id
    });

    // Check response format, has item name
    expect(response).toMatchObject({
      data: {
        addItem: {
          list: {
            items: [
              {
                name: itemName
              }
            ]
          }
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
        bold: false,
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
    await userWithList().catch((err) =>
      console.log('we have an error in here: ', err)
    ); // Creates one list in database

    const allUserLists = await UserToList.find({});
    const itemName = faker.name.jobDescriptor();

    // Unauthorized client sending request to list

    const response = await graphqlCall({
      source: addItemMutation,
      variableValues: {
        listId: allUserLists[0].listId,
        name: itemName
      },
      userId: undefined
    }).catch((err) => console.log('this one is an error:', err));

    expect(response).toMatchObject({
      errors: [
        {
          message: 'Not authenticated..'
        }
      ]
    });
  });
});
