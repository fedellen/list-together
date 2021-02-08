import { SubscriptionPayload } from '../resolvers/types/subscription/SubscriptionPayload';
import { UserToList } from '../entities';

export const removeFromSharedLists = async (
  userToList: UserToList,
  itemNameArray: string[],
  publish: (payload: SubscriptionPayload) => Promise<void>
) => {
  const allUserToListTables = await UserToList.find({
    where: { listId: userToList.listId }
  });

  const sharedUserToListTables = allUserToListTables.filter(
    (list) => list.userId !== userToList.userId
  );

  if (sharedUserToListTables.length > 0) {
    /** List has shared users, remove from their sortedItems array */
    await Promise.all(
      sharedUserToListTables.map(async (table) => {
        if (!table.sortedItems) {
          console.error('Shared list has no sortedItems..');
        } else {
          table.sortedItems = table.sortedItems.filter(
            (item) => !itemNameArray.includes(item)
          );
        }
      })
    );

    await publish({
      updatedListId: userToList.listId,
      /** Don't notify user who deleted the item */
      userIdToExclude: userToList.userId,
      notification: `${
        itemNameArray.length === 1
          ? `${itemNameArray[0]} has been`
          : 'Items have been'
      } removed from list: ${userToList.list.title}`
    });
  }
};
