export const userListFragment = `
{
  userId
  listId
  privileges
  mostCommonWords
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
