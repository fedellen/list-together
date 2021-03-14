import { Item, ItemHistory } from '../../entities';
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
import { validateStringLength } from '../types/validators/validateStringLength';
import { getUserListTable } from '../../services/list/getUserListTable';
import { recentlyAddedCallback } from '../../services/item/recentlyAddedCallback';

@Resolver()
export class AddItemResolver {
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async addItem(
    @Arg('data') { nameInput: nameInputArray, listId }: AddItemInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId,
      relations: ['itemHistory', 'list', 'list.items'],
      validatePrivilege: 'add'
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    // Validate string length between 2-30

    const list = userToListTable.list;
    const striked = nameInputArray.length > 1;
    for (const itemName of nameInputArray) {
      const stringLengthErrors = validateStringLength(itemName);
      if (stringLengthErrors) return { errors: stringLengthErrors };

      if (!list.items) {
        // Initialize list with first item
        list.items = [Item.create({ name: itemName, strike: striked })];
      } else {
        // Validate for max list length and if item already exists on list
        const addItemErrors = validateAddToList(list, itemName);
        if (addItemErrors) return { errors: addItemErrors };
        // Add item to the list
        else
          list.items = [
            Item.create({ name: itemName, strike: striked }),
            ...list.items
          ];
      }
      if (
        userToListTable.removedItems &&
        userToListTable.removedItems.includes(itemName)
      ) {
        // Delete re-added items from removedItems callback array if item deleted recently
        userToListTable.removedItems = userToListTable.removedItems.filter(
          (i) => i !== itemName
        );
      } else {
        // Add item to User's personal item history for auto-completion and smart-sort
        if (!userToListTable.itemHistory) {
          // Initialize item history
          userToListTable.itemHistory = [
            ItemHistory.create({ item: itemName })
          ];
        } else {
          const existingItemInHistory = userToListTable.itemHistory.find(
            ({ item }) => item === itemName
          );

          if (existingItemInHistory) {
            existingItemInHistory.timesAdded++;
          } else {
            userToListTable.itemHistory = [
              ...userToListTable.itemHistory,
              ItemHistory.create({ item: itemName })
            ];
          }
        }
      }

      /** Also add the new item to the recentlyAddedItems field */
      if (!userToListTable.recentlyAddedItems) {
        userToListTable.recentlyAddedItems = [itemName];
      } else {
        userToListTable.recentlyAddedItems = [
          ...userToListTable.recentlyAddedItems,
          itemName
        ];
      }
      // Trigger callback to remove recently added item
      recentlyAddedCallback(userToListTable, itemName);

      // Add to user's sortedItems
      if (striked) {
        if (!userToListTable.sortedItems) {
          userToListTable.sortedItems = [itemName];
        } else {
          userToListTable.sortedItems = [
            ...userToListTable.sortedItems,
            itemName
          ];
        }
      } else {
        userToListTable.sortedItems = sortIntoList(userToListTable, itemName);
      }
    }

    // Send promise to add to and update shared lists

    // Save table to DB, cascades list updates
    await userToListTable.save();
    addToSharedLists(userToListTable, nameInputArray, publish);

    return { userToList: [userToListTable] };
  }
}
