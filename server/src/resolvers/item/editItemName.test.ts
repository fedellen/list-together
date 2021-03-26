import { UserToList } from '../../entities';
import { userWithItemHistory } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListFragment } from '../../test-helpers/fragments/userListFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';
import faker from 'faker';

const editItemNameMutation = `
mutation EditItemName($data: EditItemNameInput!) {
  editItemName(data: $data) {
    ${userListFragment}
    ${fieldErrorFragment}
  }
}
`;

describe('Edit item name mutation:', () => {
  it('Users can edit the names of items on their list', async () => {
    const user = await userWithItemHistory();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);
    const newItemName = faker.name.firstName();

    const response = await graphqlCall({
      source: editItemNameMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemNameArray[0],
          newItemName: newItemName
        }
      },
      userId: user.id
    });

    const userToList: UserToList = response.data!.editItemName.userToList[0];

    // Check on response format, has new item name
    expect(userToList.list.items![0]).toMatchObject({
      name: newItemName
    });
    // Item history has new item name
    expect(
      userToList.itemHistory
        ?.map((history) => history.item)
        .includes(newItemName)
    ).toBe(true);
    // sortedItems has new item name
    expect(userToList.sortedItems?.includes(newItemName)).toBe(true);

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });

    // List in database no longer has old item name
    expect(
      listConnectionInDatabase?.list.items
        ?.map((item) => item.name)
        .includes(itemNameArray[0])
    ).toBe(false);
  });
});
