export const arrayMove = (array: string[], from: number, to: number) => {
  const sortedArray = array.slice();
  sortedArray.splice(to, 0, sortedArray.splice(from, 1)[0]);
  return sortedArray;
};
