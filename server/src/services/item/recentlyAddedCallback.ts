import { UserToList } from '../../entities';

/**
 * Todo: Convert callbacks to Redis to prevent callbacks
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
  if (process.env.NODE_ENV === 'production') callbackDelay = 1000 * 60 * 30; // 30 minutes in prod
  if (process.env.NODE_ENV === 'test') return; // Don't run callbacks in test yet

  setTimeout(async () => {
    // Get current UserToList, with itemHistory
    const currentList = await UserToList.findOne({
      where: { listId: userToList.listId, userId: userToList.userId }
    });

    // Dont run if:
    if (!currentList) {
      // UserToList table has been deleted
      return;
    } else if (!currentList.recentlyAddedItems) {
      // recentlyAddedItems has already been cleared?
      return;
    }
    currentList.recentlyAddedItems = currentList.recentlyAddedItems.filter(
      (i) => i === itemName
    );
    currentList.save();
  }, callbackDelay);
};
