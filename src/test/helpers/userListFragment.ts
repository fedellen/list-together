export const userListFragment = `
{
  userId
  listId
  privileges
  mostCommonWords
  itemHistory {
    item
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
