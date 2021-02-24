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
import { DeleteNoteInput } from '../types/input/DeleteNoteInput';
import { ItemResponse } from '../types/response/ItemResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { getUserListTable } from '../../services/list/getUserListTable';

@Resolver()
export class DeleteNoteResolver {
  // Delete note from an item
  @UseMiddleware(logger)
  @Mutation(() => ItemResponse)
  async deleteNote(
    @Arg('data') { note, itemName, listId }: DeleteNoteInput,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>,
    @Ctx() context: MyContext
  ): Promise<ItemResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId,
      relations: ['list', 'list.items'],
      validatePrivilege: 'delete',
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
            field: 'itemName',
            message: `Item "${itemName}" was not found on the list..`
          }
        ]
      };
    }

    const noteExists = item.notes?.find((n) => n === note);
    if (!noteExists) {
      return {
        errors: [
          {
            field: 'note',
            message: `"${note}" was not found on that item..`
          }
        ]
      };
    }

    const newNotesArray = item.notes!.filter((n) => n !== note);
    item.notes = newNotesArray;

    await item.save();
    publish({ updatedListId: listId, userIdToExclude: userToListTable.userId });

    return { item: item };
  }
}
