export const userListFragment = `
{
  userId
  listId
  privileges
  mostCommonWords
  autoSortedList
  itemHistory {
    item
    timesAdded
    removalOrder
  }
  list {
    title
    items {
      name
      notes
      strike
      bold
    }
  }
}
`;
