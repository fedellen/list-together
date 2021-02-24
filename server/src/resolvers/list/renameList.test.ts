import faker from 'faker';
import { UserToList, List } from '../../entities';
import {
  userWithList,
  createUserWithSharedPriv
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { listPartial } from '../../test-helpers/fragments/listPartial';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const renameListMutation = `
  mutation RenameList($name: String!, $listId: String!) {
    renameList(name: $name, listId: $listId) {
      ${listPartial}
      ${fieldErrorFragment}
    }
  }
`;

describe('Rename list mutation:', () => {
  it('Owner of list can rename the list', async () => {
    const listOwner = await userWithList();
    const ownersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const listId = ownersUserToListTable!.listId;
    const newListName = faker.name.jobArea();

    const response = await graphqlCall({
      source: renameListMutation,
      variableValues: { name: newListName, listId: listId },
      userId: listOwner.id
    });

    expect(response).toMatchObject({
      data: {
        renameList: {
          list: {
            title: newListName
          }
        }
      }
    });

    // New list name is saved to database
    const listInDatabaseAfter = await List.findOne(listId);
    expect(listInDatabaseAfter!.title).toBe(newListName);
  });

  it('Non-owners cannot rename the list', async () => {
    const listOwner = await userWithList();
    const ownersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const listId = ownersUserToListTable!.listId;
    const newListName = faker.name.jobArea();

    const sharedUser = await createUserWithSharedPriv(listId, 'add');

    const response = await graphqlCall({
      source: renameListMutation,
      variableValues: { name: newListName, listId: listId },
      userId: sharedUser.id
    });

    expect(response).toMatchObject({
      data: {
        renameList: {
          errors: [
            {
              field: 'privileges',
              message: 'User does not have the correct "owner" privilege..'
            }
          ]
        }
      }
    });

    // New list name is NOT saved to database
    const listInDatabaseAfter = await List.findOne(listId);
    expect(listInDatabaseAfter!.title).toBe('my-test-list-0');
  });
});
