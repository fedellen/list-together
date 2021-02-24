import { UserToList, User } from '../../entities';
import { userWithList } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const sortListsMutation = `
  mutation SortLists($data: StringArrayInput!) {
    sortLists(data: $data) {
      user {
        id
        sortedListsArray
      }
      ${fieldErrorFragment}
    } 
  }
`;

describe('Sort lists mutation:', () => {
  it('User can sort the order of in which their lists are displayed', async () => {
    const user = await userWithList(4);
    const userToListTableArray = await UserToList.find({
      where: { userId: user.id }
    });
    const listIdArray = userToListTableArray.map((table) => table.listId);

    const reversedListIdArray = listIdArray.reverse();

    const response = await graphqlCall({
      source: sortListsMutation,
      variableValues: { data: { stringArray: reversedListIdArray } },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        sortLists: {
          user: {
            sortedListsArray: reversedListIdArray,
            id: user.id
          }
        }
      }
    });

    const userAfter = await User.findOne(user.id);
    expect(userAfter!.sortedListsArray).toMatchObject(reversedListIdArray);
  });
});
