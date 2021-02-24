import { UserToList } from '../../entities';
import { userWithListAndItems } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { userListPartial } from '../../test-helpers/fragments/userListPartial';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const sortItemsMutation = `
  mutation SortItems($data: StringArrayInput!, $listId: String!) {
    sortItems(data: $data, listId: $listId) {
      ${userListPartial}
      ${fieldErrorFragment}
    }
  }
`;

describe('Sort items mutation:', () => {
  it('User can submit their re-ordered list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((item) => item.name);
    expect(itemNameArray).toHaveLength(5);
    const reversedItemArray = itemNameArray!.reverse();

    const response = await graphqlCall({
      source: sortItemsMutation,
      variableValues: {
        data: { stringArray: reversedItemArray },
        listId: userToListTable!.listId
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        sortItems: {
          userToList: [
            {
              sortedItems: reversedItemArray
            }
          ]
        }
      }
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter!.sortedItems).toMatchObject(reversedItemArray);
  });
});
