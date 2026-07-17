import { UserToList } from '../../entities';
import { userWithListAndItems } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListPartial } from '../../test-helpers/fragments/userListPartial';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const snapshotListMutation = `
  mutation SnapshotList($data: SnapshotListInput!) {
    snapshotList(data: $data) {
      ${userListPartial}
      ${fieldErrorFragment}
    }
  }
`;

describe('Snapshot list mutation:', () => {
  it('User can submit their re-ordered list', async () => {
    const user = await userWithListAndItems(5);
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const sortedItemsArray = userToListTable!.sortedItems!;
    // scramble the sortedItemsArray to simulate user re-ordering
    const scrambledItemArray = [
      sortedItemsArray[2],
      sortedItemsArray[0],
      sortedItemsArray[1],
      sortedItemsArray[3],
      sortedItemsArray[4]
    ];

    const items: { name: string; notes: string[]; strike: boolean }[] = [];
    scrambledItemArray.forEach((itemName) => {
      const item = userToListTable!.list.items!.find(
        (i) => i.name === itemName
      );
      if (item) {
        items.push({
          name: item.name,
          notes: item.notes ? [...item.notes] : [],
          strike: item.strike
        });
      }
    });
    const response = await graphqlCall({
      source: snapshotListMutation,
      variableValues: {
        data: {
          items,
          listId: userToListTable!.listId
        }
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        snapshotList: {
          userToList: [
            {
              sortedItems: scrambledItemArray
            }
          ]
        }
      }
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter!.sortedItems).toMatchObject(scrambledItemArray);
  });
});
