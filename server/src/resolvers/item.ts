import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { logger } from '../middleware/logger';
import { MyContext } from '../MyContext';

import { /*Item, ItemHistory,*/ UserToList } from '../entities';

import { StyleItemInput } from './types/input/StyleItemsInput';
import { AddNoteInput } from './types/input/AddNoteInput';

import { UserToListResponse } from './types/response/UserToListResponse';
import { ItemResponse } from './types/response/ItemResponse';

import { validateContext } from './types/validators/validateContext';
import { SubscriptionPayload } from './types/subscription/SubscriptionPayload';
import { Topic } from './types/subscription/SubscriptionTopics';
import { validateStringLength } from './types/validators/validateStringLength';
import { itemRemovalCallback } from '../services/item/itemRemovalCallback';
import { sortIntoList } from '../services/item/sortIntoList';
import { validateUserToList } from './types/validators/validateUserToList';
import { DeleteNoteInput } from './types/input/DeleteNoteInput';

@Resolver()
export class ItemResolver {
  // Style items on list
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async styleItem(
    @Arg('data') { listId, style, itemName }: StyleItemInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'strike',
      validateItemsExist: true
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable || !userToListTable.list.items)
      throw new Error('UserList validation error on `strikeItems`..');

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

    // Style the item
    if (style === 'bold') {
      item.bold = !item.bold;
    } else {
      item.strike = !item.strike;
      // Sort to bottom
    }

    if (item.strike) {
      /** Sort striked items to the end of the list */
      if (userToListTable.sortedItems) {
        const newSortedItems = userToListTable.sortedItems.filter(
          (i) => i !== item.name
        );
        userToListTable.sortedItems = [...newSortedItems, item.name];
      }
      /** Add to removalArray */
      if (userToListTable.removedItems) {
        userToListTable.removedItems = [
          ...userToListTable.removedItems,
          item.name
        ];
      } else {
        userToListTable.removedItems = [item.name];
      }
      itemRemovalCallback(userToListTable, item.name);
    } else {
      /** Sort unstriked items to the end of the list */
      if (userToListTable.sortedItems) {
        const sortedItemsWithoutUnstriked = userToListTable.sortedItems.filter(
          (i) => i !== item.name
        );
        userToListTable.sortedItems = sortedItemsWithoutUnstriked;
        const newSortedItems = sortIntoList(userToListTable, item.name)
          .sortedItems;
        userToListTable.sortedItems = newSortedItems;
      }
      // Item was unstriked -- remove it from removalArray
      if (userToListTable.removedItems?.includes(item.name)) {
        userToListTable.removedItems = userToListTable.removedItems.filter(
          (i) => i !== item.name
        );
      }
    }

    await userToListTable.save();
    await publish({ updatedListId: listId, userIdToExclude: userId });
    return { userToList: [userToListTable] };
  }

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
  // Delete array of items from list
  // Items will usually be deleted in batches from front-end `deleteStrikes`
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
