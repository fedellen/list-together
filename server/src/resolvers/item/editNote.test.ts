import { UserToList } from '../../entities';
import { userWithListAndOneItemWithNote } from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';
import faker from 'faker';
import { itemFragment } from '../../test-helpers/fragments/itemFragment';

const editNoteMutation = `
mutation EditNote($data: EditNoteInput!) {
  editNote(data: $data) {
    item {
      ${itemFragment}
    } 
    ${fieldErrorFragment}
  }
}
`;

describe('Edit note mutation:', () => {
  it('Users can edit the notes of items on their list', async () => {
    const user = await userWithListAndOneItemWithNote(5);
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const item = userToListTable!.list.items![0];
    const note = item.notes![2];

    const newNote = faker.name.firstName();

    const response = await graphqlCall({
      source: editNoteMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: item.name,
          note: note,
          newNote: newNote
        }
      },
      userId: user.id
    });

    // Check response format
    expect(response).toMatchObject({
      data: {
        editNote: {
          errors: null,
          item: {
            name: item.name
          }
        }
      }
    });

    // Note has been changed, in correct index
    expect(response.data?.editNote.item.notes[2]).toBe(newNote);

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    // List in database has new note, in correct index
    expect(listConnectionInDatabase!.list.items![0].notes![2]).toBe(newNote);
  });
});
