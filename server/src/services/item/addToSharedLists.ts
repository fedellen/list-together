import { SubscriptionPayload } from '../../resolvers/types/subscription/SubscriptionPayload';
import { UserToList } from '../../entities';
import { sortIntoList } from './sortIntoList';
import { getSharedListTables } from '../list/getSharedListTables';

/** Add item to all shared UserToList's sortedItem arrays */
export const addToSharedLists = async (
  userToList: UserToList,
  itemName: string,
  publish: (payload: SubscriptionPayload) => Promise<void>
) => {
  const sharedUserToListTables = await getSharedListTables(userToList);

  if (sharedUserToListTables.length > 0) {
    // List has shared users, add to their lists
    await Promise.all(
      sharedUserToListTables.map(async (table) => {
        table.sortedItems = sortIntoList(table, itemName);
        await table.save();
      })
    );
    // Notify all logged in users
    await publish({
      updatedListId: userToList.listId,
      // Don't notify user who added the item
      userIdToExclude: userToList.userId,
      notification: `${itemName} was added to ${userToList.list.title}`
    });
  }
};
