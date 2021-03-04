import { UserToList } from '../../entities';

/** Insert item into sortedItems array of UserToList with `itemHistory` */
export const sortIntoList = (
  /** UserToList with `itemHistory` */
  userToList: UserToList,
  itemName: string
): UserToList => {
  if (!userToList.sortedItems) {
    // UserToList has no sortedItems array, initialize
    userToList.sortedItems = [itemName];
  } else {
    // Find item in list
    const itemInHistory = userToList.itemHistory?.find(
      (history) => itemName === history.item
    );
    if (!itemInHistory?.removalRatingArray) {
      // Item has no history, insert at the front of current sortedItems
      userToList.sortedItems = [itemName, ...userToList.sortedItems];
    } else {
      // User has removal history for item
      // Insert item into user's preferred order
      const itemRating = itemInHistory.removalRating(itemInHistory);
      const indexToInsert = Math.round(
        // Convert rating (1-1000) into decimal, then multiply by length to find index
        userToList.sortedItems.length * (itemRating / 1000)
      );
      userToList.sortedItems = userToList.sortedItems.splice(
        indexToInsert,
        0,
        itemName
      );
    }
  }
  return userToList;
};
