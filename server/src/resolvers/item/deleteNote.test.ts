import { List, UserToList } from '../../entities';
import {
  createUserWithSharedPriv,
  userWithListAndOneItemWithNote
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { itemFragment } from '../../test-helpers/fragments/itemFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const deleteNoteMutation = `
mutation DeleteNote($data: DeleteNoteInput!) {
  deleteNote(data: $data) {
    item {
      ${itemFragment}
    } 
    ${fieldErrorFragment}
  }
}
`;

describe('Delete note mutation:', () => {
  it('User can delete notes from items on their own list', async () => {
    const user = await userWithListAndOneItemWithNote();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    // List has item with note
    expect(userToListTable!.list.items![0].notes!.length).toBe(1);

    const itemName = userToListTable!.list.items![0].name;
    const note = userToListTable!.list.items![0].notes![0];

    const response = await graphqlCall({
      source: deleteNoteMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemName,
          note: note
        }
      },
      userId: user.id
    });

    // Response has empty note array
    expect(response).toMatchObject({
      data: {
        deleteNote: {
          item: {
            notes: []
          }
        }
      }
    });

    const listInDatabase = await List.findOne({
      where: { id: userToListTable!.listId },
      relations: ['items']
    });
    // Item in database has note deleted
    expect(listInDatabase!.items![0].notes!.length).toBe(0);
  });

  it('User with shared `delete` privileges can remove notes on items', async () => {
    const listOwner = await userWithListAndOneItemWithNote();
    const listOwnersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnersUserToListTable!.listId,
      'delete'
    );

    // List has item with note
    expect(listOwnersUserToListTable!.list.items![0].notes!.length).toBe(1);

    const itemName = listOwnersUserToListTable!.list.items![0].name;
    const note = listOwnersUserToListTable!.list.items![0].notes![0];

    const response = await graphqlCall({
      source: deleteNoteMutation,
      variableValues: {
        data: {
          listId: listOwnersUserToListTable!.listId,
          itemName: itemName,
          note: note
        }
      },
      userId: sharedUser.id
    });

    // Response has empty note array
    expect(response).toMatchObject({
      data: {
        deleteNote: {
          item: {
            notes: []
          }
        }
      }
    });

    const listInDatabase = await List.findOne({
      where: { id: listOwnersUserToListTable!.listId },
      relations: ['items']
    });
    // Item in database has note deleted
    expect(listInDatabase!.items![0].notes!.length).toBe(0);
  });

  it('User with shared `strike` privileges or lower cannot remove notes on items', async () => {
    const listOwner = await userWithListAndOneItemWithNote();
    const listOwnersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnersUserToListTable!.listId,
      'strike'
    );

    // List has item with note
    expect(listOwnersUserToListTable!.list.items![0].notes!.length).toBe(1);

    const itemName = listOwnersUserToListTable!.list.items![0].name;
    const note = listOwnersUserToListTable!.list.items![0].notes![0];

    const response = await graphqlCall({
      source: deleteNoteMutation,
      variableValues: {
        data: {
          listId: listOwnersUserToListTable!.listId,
          itemName: itemName,
          note: note
        }
      },
      userId: sharedUser.id
    });

    // Response has correct error message
    expect(response).toMatchObject({
      data: {
        deleteNote: {
          errors: [
            {
              field: 'privileges',
              message: 'User does not have the correct "delete" privilege..'
            }
          ]
        }
      }
    });

    const listInDatabase = await List.findOne({
      where: { id: listOwnersUserToListTable!.listId },
      relations: ['items']
    });
    // Item in database has note still
    expect(listInDatabase!.items![0].notes!.length).toBe(1);
  });
});
