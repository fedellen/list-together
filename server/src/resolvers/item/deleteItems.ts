import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { removeFromSharedLists } from '../../services/item/removeFromSharedLists';
import {
  UseMiddleware,
  Mutation,
  Arg,
  Publisher,
  Ctx,
  PubSub,
  Resolver
} from 'type-graphql';
import { DeleteItemsInput } from '../types/input/DeleteItemsInput';
import { FieldError } from '../types/response/FieldError';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { itemRemovalCallback } from '../../services/item/itemRemovalCallback';
import { getUserListTable } from '../../services/list/getUserListTable';

@Resolver()
export class DeleteItemsResolver {
  // Delete array of items from list
  // Items will usually be deleted in batches from front-end `deleteStrikes`
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async deleteItems(
    @Arg('data') { itemNameArray, listId }: DeleteItemsInput,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId,
      relations: ['list', 'list.items', 'itemHistory'],
      validatePrivilege: 'delete',
      validateItemsExist: true
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

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

      if (
        userToListTable.recentlyAddedItems &&
        userToListTable.recentlyAddedItems.includes(itemName)
      ) {
        const itemInHistory = userToListTable.itemHistory?.find(
          (history) => history.item === itemName
        );
        /** Item should be in history if on recentlyAddedItems */
        if (!itemInHistory || !userToListTable.itemHistory) {
          const error = {
            field: 'itemHistory',
            message:
              'Error: Recently added item has no itemHistory for `deleteItems`'
          };
          deleteErrors = [...deleteErrors, error];
          return;
        }
        if (itemInHistory.timesAdded === 1) {
          userToListTable.itemHistory = userToListTable.itemHistory?.filter(
            (history) => history.item !== itemName
          );
        } else {
          itemInHistory.timesAdded--;
        }
        userToListTable.recentlyAddedItems = userToListTable.recentlyAddedItems.filter(
          (i) => i !== itemName
        );
      } else {
        // Add to removalArray for callback
        if (userToListTable.removedItems) {
          userToListTable.removedItems = [
            ...userToListTable.removedItems,
            itemName
          ];
        } else {
          userToListTable.removedItems = [itemName];
        }
        itemRemovalCallback(userToListTable, itemName);
      }
    });

    removeFromSharedLists(userToListTable, itemNameArray, publish);

    await userToListTable.save();
    return {
      userToList: [userToListTable],
      errors: deleteErrors.length > 0 ? deleteErrors : undefined
    };
  }
}
