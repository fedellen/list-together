import { UserToList } from '../../entities';

/** Insert item into sortedItems array of UserToList */
export const sortIntoList = (
  userToList: UserToList,
  itemName: string,
  striked = false
  // indexOfLastInteraction: number TODO: Use last touch on screen for list add? Consider List Options
): string[] => {
  if (!userToList.sortedItems || userToList.sortedItems.length < 1) {
    // UserToList sortedItems array is null or empty, initialize
    return [itemName];
  }

  if (striked) {
    return [...userToList.sortedItems, itemName];
  }

  return [itemName, ...userToList.sortedItems];
};
