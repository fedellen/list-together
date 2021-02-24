import { UserToList } from '../../entities';
import { userWithItemHistory } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListItemHistoryPartial } from '../../test-helpers/fragments/userListItemHistoryPartial';
import { graphqlCall } from '../../test-helpers/graphqlCall';

export const submitPreferredOrderMutation = `
  mutation SubmitPreferredOrder($data: PreferredOrderInput!) {
    submitPreferredOrder(data: $data) {
      ${userListItemHistoryPartial}
      ${fieldErrorFragment}
    }
  }
`;

// Submit and merge removalOrder results for Auto-Sort feature
describe('Submit preferred order mutation:', () => {
  it('User can save a sorted array of items into their removalRatingArray as their preferred order, api returns average rating for each item', async () => {
    const user = await userWithItemHistory();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
    expect(userToListTable!.itemHistory![0].removalRatingArray).toBeNull;

    const itemNameArray = userToListTable!.list.items!.map((item) => item.name);
    expect(itemNameArray).toHaveLength(10);

    const response = await graphqlCall({
      source: submitPreferredOrderMutation,
      variableValues: {
        data: {
          removedItemArray: itemNameArray,
          listId: userToListTable!.listId
        }
      },
      userId: user.id
    });

    expect(
      response.data?.submitPreferredOrder.userToList[0].itemHistory
    ).toMatchObject([
      {
        item: itemNameArray[0],
        removalRating: 50
      },
      {
        item: itemNameArray[1],
        removalRating: 150
      },
      {
        item: itemNameArray[2],
        removalRating: 250
      },
      {
        item: itemNameArray[3],
        removalRating: 350
      },
      {
        item: itemNameArray[4],
        removalRating: 450
      },
      {
        item: itemNameArray[5],
        removalRating: 550
      },
      {
        item: itemNameArray[6],
        removalRating: 650
      },
      {
        item: itemNameArray[7],
        removalRating: 750
      },
      {
        item: itemNameArray[8],
        removalRating: 850
      },
      {
        item: itemNameArray[9],
        removalRating: 950
      }
    ]);

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['itemHistory']
    });
    expect(
      userToListTableAfter!.itemHistory![0].removalRatingArray
    ).toHaveLength(10);
    expect(
      userToListTableAfter!.itemHistory![0].removalRatingArray
    ).toStrictEqual([
      '50',
      '50',
      '50',
      '50',
      '50',
      '50',
      '50',
      '50',
      '50',
      '50'
    ]);
    expect(
      userToListTableAfter!.itemHistory![1].removalRatingArray
    ).toStrictEqual([
      '150',
      '150',
      '150',
      '150',
      '150',
      '150',
      '150',
      '150',
      '150',
      '150'
    ]);
    expect(
      userToListTableAfter!.itemHistory![9].removalRatingArray
    ).toStrictEqual([
      '950',
      '950',
      '950',
      '950',
      '950',
      '950',
      '950',
      '950',
      '950',
      '950'
    ]);
  });

  it('Pushes item in index 0 off the list to store only recent ratings', async () => {
    const user = await userWithItemHistory(true);
    // Returns user with unique rating at index 0
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
    const itemNameArray = userToListTable!.list
      .items!.map((item) => item.name)
      .reverse(); // reverse to submit in correct order
    const removalRatingAtIndexZero = userToListTable!.itemHistory![0]
      .removalRatingArray![0];

    await graphqlCall({
      source: submitPreferredOrderMutation,
      variableValues: {
        data: {
          removedItemArray: itemNameArray,
          listId: userToListTable!.listId
        }
      },
      userId: user.id
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['itemHistory']
    });
    const isRatingOnList = userToListTableAfter!.itemHistory![0].removalRatingArray!.find(
      (rating) => rating === removalRatingAtIndexZero
    );

    expect(isRatingOnList).toBeUndefined();
  });
});
