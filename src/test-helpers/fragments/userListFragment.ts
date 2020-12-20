export const userListFragment = `
  userToList {
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
