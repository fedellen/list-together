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

import { Item, ItemHistory, UserToList } from '../entities';

import { StyleItemInput } from './types/input/StyleItemsInput';
import { AddNoteInput } from './types/input/AddNoteInput';
import { AddItemInput } from './types/input/AddItemInput';
import { DeleteItemsInput } from './types/input/DeleteItemsInput';

import { UserToListResponse } from './types/response/UserToListResponse';
import { ItemResponse } from './types/response/ItemResponse';

import { FieldError } from './types/response/FieldError';
import { validateContext } from './types/validators/validateContext';
import { SubscriptionPayload } from './types/subscription/SubscriptionPayload';
import { Topic } from './types/subscription/SubscriptionTopics';
import { validateStringLength } from './types/validators/validateStringLength';
import { itemRemovalCallback } from '../utils/itemRemovalCallback';
import { sortIntoList } from '../utils/sortIntoList';
import { addToSharedLists } from '../utils/addToSharedLists';
import { validateUserToList } from './types/validators/validateUserToList';
import { validateAddToList } from './types/validators/validateAddToList';
import { removeFromSharedLists } from '../utils/removeFromSharedLists';

@Resolver()
export class ItemResolver {
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async addItem(
    @Arg('data') { nameInput, listId }: AddItemInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    const contextErrors = validateContext(context);
    if (contextErrors) return { errors: contextErrors };

    const stringLengthErrors = validateStringLength(nameInput);
    if (stringLengthErrors) return { errors: stringLengthErrors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items', 'itemHistory']
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'add'
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable)
      throw new Error('UserList validation error on `addItem`..');

    const list = userToListTable.list;
    if (!list.items) {
      // Initialize list
      list.items = [Item.create({ name: nameInput })];
    } else {
      const addItemErrors = validateAddToList(list, nameInput);
      // Validation for max list length and if item already exists
      if (addItemErrors) return { errors: addItemErrors };
      else list.items = [Item.create({ name: nameInput }), ...list.items];
    }

    // Add item to User's personal item history for auto-completion and smart-sort
    if (!userToListTable.itemHistory) {
      // Initialize item history
      userToListTable.itemHistory = [ItemHistory.create({ item: nameInput })];
    } else {
      const existingItemInHistory = userToListTable.itemHistory.find(
        ({ item }) => item === nameInput
      );

      if (existingItemInHistory) {
        existingItemInHistory.timesAdded++;
      } else {
        userToListTable.itemHistory = [
          ...userToListTable.itemHistory,
          ItemHistory.create({ item: nameInput })
        ];
      }
    }

    // Add to sortedItems
    const userToListTableAfterSort = sortIntoList(userToListTable, nameInput);
    addToSharedLists(userToListTable, nameInput, publish);

    // Save table to DB, cascades list updates
    await userToListTableAfterSort.save();

    return { userToList: [userToListTableAfterSort] };
  }

  // Delete array of items from list
  // Items will usually be deleted in batches from front-end `deleteStrikes`
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async deleteItems(
    @Arg('data') { itemNameArray, listId }: DeleteItemsInput,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>,
    @Ctx() context: MyContext
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
      validatePrivilege: 'delete',
      validateItemsExist: true
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable || !userToListTable.list.items)
      throw new Error('UserList validation error on `deleteItems`..');

    // Store each error, continue deleting items in the case of conflicts
    let deleteErrors: FieldError[] = [];
    itemNameArray.forEach(async (itemName) => {
      const itemExists = userToListTable.list.items!.find(
        ({ name }) => name === itemName
      );
      if (!itemExists) {
        const error = {
          field: 'itemName',
          message: `Item "${itemName}" was not found on the list..`
        };
        deleteErrors = [...deleteErrors, error];

        return;
      }

      if (userToListTable.sortedItems) {
        // Remove the deleted items from user's sorted list
        userToListTable.sortedItems = userToListTable.sortedItems.filter(
          (item) => item !== itemExists.name
        );
      }
      userToListTable.list.items! = userToListTable.list.items!.filter(
        (item) => item.name !== itemExists.name
      );
    });

    removeFromSharedLists(userToListTable, itemNameArray, publish);

    await userToListTable.save();
    return {
      userToList: [userToListTable],
      errors: deleteErrors.length > 0 ? deleteErrors : undefined
    };
  }

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
      }
      item.notes = [...item.notes, note];
    }

    await item.save();
    await publish({ updatedListId: listId, userIdToExclude: userId });
    return { item };
  }
}
