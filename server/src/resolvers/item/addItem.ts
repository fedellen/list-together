import { UserToList, Item, ItemHistory } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { addToSharedLists } from '../../services/item/addToSharedLists';
import { sortIntoList } from '../../services/item/sortIntoList';
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { AddItemInput } from '../types/input/AddItemInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { validateAddToList } from '../types/validators/validateAddToList';
import { validateContext } from '../types/validators/validateContext';
import { validateStringLength } from '../types/validators/validateStringLength';
import { validateUserToList } from '../types/validators/validateUserToList';

@Resolver()
export class AddItemResolver {
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
      // UserToList should be valid if no errors
      throw new Error('UserList validation error on `addItem`..');

    const list = userToListTable.list;
    if (!list.items) {
      // Initialize list with first item
      list.items = [Item.create({ name: nameInput })];
    } else {
      // Validation for max list length and if item already exists
      const addItemErrors = validateAddToList(list, nameInput);
      if (addItemErrors) return { errors: addItemErrors };
      // Add item to the list
      else list.items = [Item.create({ name: nameInput }), ...list.items];
    }

    if (
      userToListTable.removedItems &&
      userToListTable.removedItems.includes(nameInput)
    ) {
      // Delete re-added items from removedItems array if item deleted recently
      userToListTable.removedItems = userToListTable.removedItems.filter(
        (i) => i !== nameInput
      );
    } else {
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
    }

    // Add to sortedItems
    const userToListTableAfterSort = sortIntoList(userToListTable, nameInput);
    addToSharedLists(userToListTable, nameInput, publish);

    // Save table to DB, cascades list updates
    await userToListTableAfterSort.save();

    return { userToList: [userToListTableAfterSort] };
  }
}
