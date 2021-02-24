import faker from 'faker';
import { UserToList } from '../../entities';
import {
  userWithListAndItems,
  createUserWithSharedPriv
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { itemFragment } from '../../test-helpers/fragments/itemFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const addNoteMutation = `
mutation AddNote($data: AddNoteInput!) {
  addNote(data: $data) {
    item {
      ${itemFragment}
    } 
    ${fieldErrorFragment}
  }
}
`;
describe('Add note mutation:', () => {
  it('User can add notes to items own their own list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);
    const noteToAdd = faker.name.firstName();

    const response = await graphqlCall({
      source: addNoteMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemNameArray[0],
          note: noteToAdd
        }
      },
      userId: user.id
    });

    // Check response format, has note
    expect(response).toMatchObject({
      data: {
        addNote: {
          item: {
            notes: [noteToAdd]
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[0]
      )!.notes![0]
    ).toBe(noteToAdd);
  });

  it('User with shared `add` privileges can add notes to items on the list', async () => {
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
    const noteToAdd = faker.name.firstName();

    const response = await graphqlCall({
      source: addNoteMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[1],
          note: noteToAdd
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        addNote: {
          item: {
            notes: [noteToAdd]
          }
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
      )!.notes![0]
    ).toBe(noteToAdd);
  });

  it('User with only `read` privileges cannot add notes to items on the list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      'read'
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );
    const noteToAdd = faker.name.jobTitle();

    const response = await graphqlCall({
      source: addNoteMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[2],
          note: noteToAdd
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        addNote: {
          errors: [
            {
              field: 'privileges',
              message: 'User does not have the correct "add" privilege..'
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
        (i) => i.name === itemNameArray[2]
      )!.notes
    ).toBeNull();
  });
});
