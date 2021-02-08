import { ItemHistory, UserToList } from '../entities';

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
  let delay = 1000 * 5; // 5 seconds in dev
  if (process.env.NODE_ENV === 'production') delay = 1000 * 60 * 30; // 30 minutes in prod
  if (process.env.NODE_ENV === 'test') return; // don't run in test
  setTimeout(async () => {
    /** Get current UserToList */
    const currentList = await UserToList.findOne({
      where: { listId: userToList.listId, userId: userToList.userId },
      relations: ['itemHistory']
    });

    if (!currentList) {
      /**  UserToList table has been deleted  */
      return;
    } else if (!currentList.removedItems) {
      /** removedItems has been cleared */
      return;
    } else if (
      currentList.removedItems.indexOf(itemName) !==
      currentList.removedItems.length - 1
    ) {
      /** Item is no longer last on removalArray */
      return;
    }

    if (currentList.removedItems.length > 2) {
      /** Only run when three or more items have been removed */
      const removedItemArray = currentList.removedItems;
      const arrayLengthRating = Math.round(1000 / removedItemArray.length);

      removedItemArray.forEach((itemRemoved) => {
        const newRemovalRating = Math.round(
          (removedItemArray.indexOf(itemRemoved) + 0.5) * arrayLengthRating
        ).toString(); // Save number as a string in Postgres

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
            // Item not in history, add new ItemHistory
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
                // Only store last 10 ratings for `recent` shopping results 👍
                itemInHistory.removalRatingArray.shift();
              }
              // Add new rating
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
     *  delete removalArrays with 1 or 2 items
     */
    currentList.removedItems = null;
    currentList.save();
  }, delay); // 30 minutes
};
