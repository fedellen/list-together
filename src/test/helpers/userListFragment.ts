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
    removalRating
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
