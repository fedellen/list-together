import { SubscriptionPayload } from '../../resolvers/types/subscription/SubscriptionPayload';
import { UserToList } from '../../entities';
import { sortIntoList } from './sortIntoList';
import { getSharedListTables } from '../list/getSharedListTables';

/** Add item to all shared UserToList's sortedItem arrays */
export const addToSharedLists = async (
  userToList: UserToList,
  itemNameArray: string[],
  publish: (payload: SubscriptionPayload) => Promise<void>
) => {
  const sharedUserToListTables = await getSharedListTables(userToList);

  if (sharedUserToListTables.length > 0) {
    // List has shared users, add to their lists
    await Promise.all(
      sharedUserToListTables.map(async (table) => {
        for (const itemName of itemNameArray) {
          table.sortedItems = sortIntoList(table, itemName);
        }
        await table.save();
      })
    );
    // Notify all logged in users
    await publish({
      updatedListId: userToList.listId,
      // Don't notify user who added the item
      userIdToExclude: userToList.userId,
      notification: `${
        itemNameArray.length > 1 ? 'Items' : `Item : '${itemNameArray[0]}'`
      } added to list: ${userToList.list.title}`
    });
  }
};
