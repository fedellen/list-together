export const userListFragment = `
  userToList {
    userId
    listId
    privileges
    mostCommonWords
    sortedItems
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
