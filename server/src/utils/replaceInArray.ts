type replaceInArrayArgs = {
  array: string[];
  oldItem: string;
  newItem: string;
};
/** Replace in array immutably with filters, returns null if item is not found */
export const replaceInArray = ({
  array,
  oldItem,
  newItem
}: replaceInArrayArgs): string[] | null => {
  const index = array.indexOf(oldItem);
  if (index === -1) return null;

  const itemsBefore = array.filter((n) => array.indexOf(n) < index);
  const itemsAfter = array.filter((n) => array.indexOf(n) > index);

  return [...itemsBefore, newItem, ...itemsAfter]; // 🔥
};
