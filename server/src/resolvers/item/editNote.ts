import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { EditNoteInput } from '../types/input/EditNoteInput';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { getUserListTable } from '../../services/list/getUserListTable';
import { ItemResponse } from '../types/response/ItemResponse';

@Resolver()
/** Edit note of item  */
export class EditNoteResolver {
  @UseMiddleware(logger)
  @Mutation(() => ItemResponse)
  async editNote(
    @Arg('data') { listId, itemName, note, newNote }: EditNoteInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<ItemResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId,
      relations: ['list', 'list.items'],
      validatePrivilege: 'add',
      validateItemsExist: true
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    const item = userToListTable.list.items!.find(
      ({ name }) => name === itemName
    );
    if (!item) {
      return {
        errors: [
          {
            field: 'name',
            message: 'Item does not exist on list..'
          }
        ]
      };
    }
    if (!item.notes) {
      return {
        errors: [
          {
            field: 'note',
            message: 'There are no notes on that item..'
          }
        ]
      };
    }

    const noteIndex = item.notes.indexOf(note);

    if (noteIndex === -1) {
      return {
        errors: [
          {
            field: 'note',
            message: 'That note does not exist on that item..'
          }
        ]
      };
    }

    const notesBefore = item.notes.filter(
      (n) => item.notes!.indexOf(n) < noteIndex
    );
    const notesAfter = item.notes.filter(
      (n) => item.notes!.indexOf(n) > noteIndex
    );

    // Change the note, in its place
    item.notes = [...notesBefore, newNote, ...notesAfter]; // 🔥

    await userToListTable.save();
    publish({
      updatedListId: listId,
      userIdToExclude: userToListTable.userId
    });
    return { item: item };
  }
}
