import { ItemHistory, UserToList } from '../../entities';

/**
 *  Gathers recently deleted/striked items into an
 *  ordered array. After 30 minutes, and if the item is
 *  still in the last index, submit the array with
 *  calculated `removalRating` values for auto-sorting lists.
 */

export const itemRemovalCallback = (
  userToList: UserToList,
  itemName: string
) => {
  let callbackDelay = 1000 * 5; // 5 seconds during dev
  if (process.env.NODE_ENV === 'production') callbackDelay = 1000 * 60 * 30; // 30 minutes in prod
  if (process.env.NODE_ENV === 'test') return; // Don't run callback in test yet

  setTimeout(async () => {
    // Get current UserToList, with itemHistory
    const currentList = await UserToList.findOne({
      where: { listId: userToList.listId, userId: userToList.userId },
      relations: ['itemHistory']
    });

    // Dont run removalCallback if:
    if (!currentList) {
      // UserToList table has been deleted
      return;
    } else if (!currentList.removedItems) {
      // removedItems has already been cleared
      return;
    } else if (
      currentList.removedItems.indexOf(itemName) !==
      currentList.removedItems.length - 1
    ) {
      // Or the item is no longer the last index on removalArray
      return;
    }

    if (currentList.removedItems.length > 2) {
      // Only run callback when three or more items have been removed
      const removedItemArray = currentList.removedItems;
      const arrayLengthRating = Math.round(1000 / removedItemArray.length);

      removedItemArray.forEach((itemRemoved) => {
        const newRemovalRating = Math.round(
          (removedItemArray.indexOf(itemRemoved) + 0.5) * arrayLengthRating
        ).toString(); // Save removalRating as a string in Postgres

        if (!currentList.itemHistory) {
          // User has no item history, initialize
          currentList.itemHistory = [
            ItemHistory.create({
              item: itemRemoved,
              removalRatingArray: [newRemovalRating]
            })
          ];
        } else {
          const itemInHistory = currentList.itemHistory.find(
            (i) => i.item === itemRemoved
          );

          if (!itemInHistory) {
            // Item has no history, create new ItemHistory
            currentList.itemHistory = [
              ...currentList.itemHistory,
              ItemHistory.create({
                item: itemRemoved,
                removalRatingArray: [newRemovalRating]
              })
            ];
          } else {
            if (!itemInHistory.removalRatingArray) {
              // Item has no removalRatings, initialize array
              itemInHistory.removalRatingArray = [newRemovalRating];
            } else {
              if (itemInHistory.removalRatingArray.length === 10) {
                // Only store last 10 ratings for recent shopping results 👍
                // When length = 10, `shift` the first rating off the list
                itemInHistory.removalRatingArray.shift();
              }
              // Add the new rating
              itemInHistory.removalRatingArray = [
                ...itemInHistory.removalRatingArray,
                newRemovalRating
              ];
            }
          }
        }
      });
    }

    /**
     *  Null and save the array from top of scope to
     *  also delete removalArrays with 1 or 2 items
     */
    currentList.removedItems = null;
    currentList.save();
  }, callbackDelay);
};
