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
import { RenameItemInput } from './types/input/RenameItemInput';

import { UserToListResponse } from './types/response/UserToListResponse';
import { ItemResponse } from './types/response/ItemResponse';

import { FieldError } from './types/response/FieldError';
import { validateContext } from './types/validators/validateContext';
import { BooleanResponse } from './types/response/BooleanResponse';
import { SubscriptionPayload } from './types/subscription/SubscriptionPayload';
import { Topic } from './types/subscription/SubscriptionTopics';
import { validateStringLength } from './types/validators/validateStringLength';

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

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'Could not find that user to list connection..'
          }
        ]
      };
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('add')
    ) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'User does not have privileges to add items to that list..'
          }
        ]
      };
    }

    const list = userToListTable.list;
    if (list.items) {
      if (list.items.length >= 300) {
        return {
          errors: [
            {
              field: 'listId',
              message: 'Lists cannot have more than 300 items..'
            }
          ]
        };
      }

      const itemExists = list.items.find(({ name }) => name === nameInput);
      if (itemExists) {
        return {
          errors: [
            {
              field: 'name',
              message: 'Item already exists on this list..'
            }
          ]
        };
      }

      list.items = [Item.create({ name: nameInput }), ...list.items];
    } else {
      // Initialize list if no items --
      list.items = [Item.create({ name: nameInput })];
    }

    // Add item to User's personal item history for auto-completion and smart-sort
    if (userToListTable.itemHistory) {
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
    } else {
      // Initialize item history
      userToListTable.itemHistory = [ItemHistory.create({ item: nameInput })];
    }

    // Save table to DB, cascades list updates
    await userToListTable.save();

    // Get all userToLists and add to their sortedItems --
    const allUserToListTables = await UserToList.find({
      where: { listId: list.id },
      relations: ['itemHistory']
    });
    await Promise.all(
      allUserToListTables.map(async (table) => {
        if (table.sortedItems) {
          const itemInHistory = table.itemHistory?.find(
            (history) => nameInput === history.item
          );
          if (itemInHistory?.removalRatingArray) {
            // User has removal history for item
            const itemRating = itemInHistory.removalRating(itemInHistory);
            const indexToInsert = Math.round(
              table.sortedItems.length * (itemRating / 1000)
            );
            console.log(
              `itemRating: "${itemRating}", indexToInsert: "${indexToInsert}" `
            );
            // Insert near user's preferred removal order
            table.sortedItems.splice(indexToInsert, 0, nameInput);
          } else {
            // Insert at front of sortedItems
            table.sortedItems = [nameInput, ...table.sortedItems];
          }
        } else {
          // Initialize sortedItems
          table.sortedItems = [nameInput];
        }
        // Save all shared tables with sorted list
        await table.save();
      })
    );
    await publish({
      updatedListId: listId,
      notification: `${nameInput} was added to ${list.title}`
    });

    // Grab sorted list and return user who added the item
    const sortedUserToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items', 'itemHistory']
    });

    return { userToList: [sortedUserToListTable!] };
  }

  // Delete array of items from list
  // Items will usually be deleted in batches from front-end `deleteStrikes`
  @UseMiddleware(logger)
  @Mutation(() => BooleanResponse)
  async deleteItems(
    @Arg('data') { itemNameArray, listId }: DeleteItemsInput,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>,
    @Ctx() context: MyContext
  ): Promise<BooleanResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'Could not find that user to list connection..'
          }
        ]
      };
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('delete')
    ) {
      return {
        errors: [
          {
            field: 'userId',
            message:
              'User does not have privileges to delete items from that list..'
          }
        ]
      };
    } else if (!userToListTable.list.items) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'List has no items to delete..'
          }
        ]
      };
    }

    // Store each error, continue deleting items in case of conflicts
    let deleteErrors: FieldError[] | undefined = undefined;
    itemNameArray.forEach(async (itemName) => {
      const itemExists = userToListTable.list.items!.find(
        ({ name }) => name === itemName
      );
      if (!itemExists) {
        const error = {
          field: 'itemName',
          message: `Item "${itemName}" was not found on the list..`
        };

        if (!deleteErrors) {
          deleteErrors = [error];
        } else {
          deleteErrors = [...deleteErrors, error];
        }
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

    await userToListTable.save();
    await publish({ updatedListId: listId });
    return { boolean: true, errors: deleteErrors };
  }

  // Style items on list
  @UseMiddleware(logger)
  @Mutation(() => ItemResponse)
  async styleItem(
    @Arg('data') { listId, style, itemName }: StyleItemInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<ItemResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'Could not find that user to list connection..'
          }
        ]
      };
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('strike') &&
      style === 'strike'
    ) {
      return {
        errors: [
          {
            field: 'userId',
            message:
              'User does not have privileges to strike items from that list..'
          }
        ]
      };
    } else if (!userToListTable.list.items) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'List has no items to style..'
          }
        ]
      };
    }

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

    await userToListTable.save();
    await publish({ updatedListId: listId });
    return { item };
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

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'Could not find that user to list connection..'
          }
        ]
      };
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('add')
    ) {
      return {
        errors: [
          {
            field: 'userId',
            message:
              'User does not have privileges to add notes to items on that list..'
          }
        ]
      };
    } else if (!userToListTable.list.items) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'List has no items to add notes to..'
          }
        ]
      };
    }

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
    await publish({ updatedListId: listId });
    return { item };
  }

  // Rename item on list
  @UseMiddleware(logger)
  @Mutation(() => ItemResponse)
  async renameItem(
    @Arg('data') { listId, newName, itemName }: RenameItemInput,
    @Ctx() context: MyContext
  ): Promise<ItemResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'Could not find that user to list connection..'
          }
        ]
      };
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('add')
    ) {
      return {
        errors: [
          {
            field: 'userId',
            message:
              'User does not have privileges to rename items on that list..'
          }
        ]
      };
    } else if (!userToListTable.list.items) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'List has no items rename..'
          }
        ]
      };
    }

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

    item.name = newName;

    await item.save();
    return { item };
  }
}
