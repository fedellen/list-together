import { UserToList } from '../../entities';
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
import { validateContext } from '../types/validators/validateContext';
import { validateUserToList } from '../types/validators/validateUserToList';

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
    const errors = validateContext(context);
    if (errors) return { errors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'delete',
      validateItemsExist: true
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable || !userToListTable.list.items)
      throw new Error('UserList validation error on `deleteNote`..');

    const item = userToListTable.list.items.find(
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
    publish({ updatedListId: listId, userIdToExclude: userId });

    return { item: item };
  }
}
