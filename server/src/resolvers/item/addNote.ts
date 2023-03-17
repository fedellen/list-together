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
import { AddNoteInput } from '../types/input/AddNoteInput';
import { ItemResponse } from '../types/response/ItemResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { validateStringLength } from '../types/validators/validateStringLength';
import { getUserListTable } from '../../services/list/getUserListTable';
import { maxNotesPerItem } from '../../constants';

@Resolver()
export class AddNoteResolver {
  // Add note to item on list
  @UseMiddleware(logger)
  @Mutation(() => ItemResponse)
  async addNote(
    @Arg('data') { listId, note, itemName }: AddNoteInput,
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

    const stringLengthErrors = validateStringLength(note);
    if (stringLengthErrors) return { errors: stringLengthErrors };

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
      // Initialize notes for item
      item.notes = [note];
    } else {
      if (item.notes.length >= maxNotesPerItem) {
        return {
          errors: [
            {
              field: 'name',
              message: `Items cannot have more than ${maxNotesPerItem} notes...`
            }
          ]
        };
      } else if (item.notes.includes(note)) {
        return {
          errors: [
            {
              field: 'name',
              message: 'Item already contains a note with that name..'
            }
          ]
        };
      }
      item.notes = [...item.notes, note];
    }

    await item.save();
    publish({ updatedListId: listId, userIdToExclude: userToListTable.userId });
    return { item };
  }
}
