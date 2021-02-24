import { UserToList } from '../../entities';
import {
  userWithListAndItems,
  createUserWithSharedPriv
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListFragment } from '../../test-helpers/fragments/userListFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const strikeItemMutation = `
mutation StrikeItem($data: StrikeItemInput!) {
  strikeItem(data: $data) {
    ${userListFragment}
    ${fieldErrorFragment}
  }
}
`;

describe('Strike item mutation:', () => {
  it('User can strike items from their own list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);

    const response = await graphqlCall({
      source: strikeItemMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemNameArray[1]
        }
      },
      userId: user.id
    });

    const userToList: UserToList = response.data!.strikeItem.userToList[0];

    // Check on response format, has strike
    expect(userToList.list.items![1]).toMatchObject({
      name: itemNameArray[1],
      strike: true
    });
    const sortedItems: string[] = userToList.sortedItems!;
    // Item should be returned  at the end of the sorted items
    expect(sortedItems[sortedItems.length - 1]).toBe(itemNameArray[1]);

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    // Item is on removal array
    expect(listConnectionInDatabase!.removedItems?.includes(itemNameArray[1]));
    // Item is striked
    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[1]
      )!.strike
    ).toBeTruthy();
  });

  it('User with shared `strike` privileges can strike items from list', async () => {
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
      source: strikeItemMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[2]
        }
      },
      userId: sharedUser.id
    });

    const userToList: UserToList = response.data!.strikeItem.userToList[0];

    // Check on response format, has strike
    expect(userToList.list.items![2]).toMatchObject({
      name: itemNameArray[2],
      strike: true
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[2]
      )!.strike
    ).toBeTruthy();
  });

  it('User without shared `strike` privileges cannot strike items from list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      'add'
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: strikeItemMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[1]
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        strikeItem: {
          errors: [
            {
              field: 'privileges',
              message: 'User does not have the correct "strike" privilege..'
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[1]
      )!.strike
    ).toBeFalsy();
  });
});
