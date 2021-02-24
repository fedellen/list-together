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
import { AddNoteInput } from '../types/input/AddNoteInput';
import { ItemResponse } from '../types/response/ItemResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { validateContext } from '../types/validators/validateContext';
import { validateStringLength } from '../types/validators/validateStringLength';
import { validateUserToList } from '../types/validators/validateUserToList';

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
    const errors = validateContext(context);
    if (errors) return { errors };

    const stringLengthErrors = validateStringLength(itemName);
    if (stringLengthErrors) return { errors: stringLengthErrors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'add',
      validateItemsExist: true
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable || !userToListTable.list.items)
      throw new Error('UserList validation error on `addNote`..');

    const item = userToListTable.list.items.find(
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
      if (item.notes.length >= 10) {
        return {
          errors: [
            {
              field: 'name',
              message: 'Items cannot have more than 10 notes..'
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
    publish({ updatedListId: listId, userIdToExclude: userId });
    return { item };
  }
}
