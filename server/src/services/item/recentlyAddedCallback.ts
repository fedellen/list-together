import { UserToList } from '../../entities';

/**
 * Todo: Convert callbacks to Redis (or cron job?) to prevent callbacks
 * from being cancelled on server restart / server down.
 *
 * This could cause some inconsistencies with User's
 * recentlyAddedItems and removedItems columns
 */

/**
 *  Gathers recently added items into an array. If an item
 *  is removed from the list while still on the array, the
 *  item's `timesAdded` field in `ItemHistory` will be
 *  reduced by 1 and the `itemRemovalCallback` will not be
 *  called. If timeAdded = 0, the `ItemHistory` will be deleted.
 */

export const recentlyAddedCallback = (
  userToList: UserToList,
  itemName: string
) => {
  let callbackDelay = 1000 * 5; // 5 seconds during dev
  if (process.env.NODE_ENV === 'production') callbackDelay = 1000 * 60 * 10; // 10 minutes in prod
  if (process.env.NODE_ENV === 'test') callbackDelay = 100; // 100ms in test

  setTimeout(async () => {
    // Get current UserToList, with itemHistory
    const currentList = await UserToList.findOne({
      where: { listId: userToList.listId, userId: userToList.userId }
    });

    // Don't run if:
    if (!currentList) {
      // UserToList table has been deleted
      return;
    } else if (!currentList.recentlyAddedItems) {
      // recentlyAddedItems has already been cleared
      return;
    } else if (!currentList.recentlyAddedItems.includes(itemName)) {
      // Item already removed (has been undone)
      return;
    }
    currentList.recentlyAddedItems = currentList.recentlyAddedItems.filter(
      (i) => i !== itemName
    );

    await currentList.save();
  }, callbackDelay);
};
