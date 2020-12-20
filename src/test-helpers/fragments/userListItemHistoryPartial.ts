export const userListItemHistoryPartial = `
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
  }
`;
