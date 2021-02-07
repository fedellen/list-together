import { UserToList } from '../entities';

export const sortIntoList = (
  userToList: UserToList,
  itemName: string
): UserToList => {
  if (!userToList.sortedItems) {
    // Initialize sortedItems
    userToList.sortedItems = [itemName];
  } else {
    const itemInHistory = userToList.itemHistory?.find(
      (history) => itemName === history.item
    );
    if (itemInHistory?.removalRatingArray) {
      // User has removal history for item
      const itemRating = itemInHistory.removalRating(itemInHistory);
      const indexToInsert = Math.round(
        userToList.sortedItems.length * (itemRating / 1000)
      );
      console.log(
        `itemRating: "${itemRating}", indexToInsert: "${indexToInsert}" `
      );
      // Insert near user's preferred removal order
      userToList.sortedItems.splice(indexToInsert, 0, itemName);
    } else {
      // Insert at front of sortedItems
      userToList.sortedItems = [itemName, ...userToList.sortedItems];
    }
  }
  return userToList;
};
