import { graphqlCall } from '../test-helpers/graphqlCall';
import faker from 'faker';
import {
  createUser,
  createUserWithSharedPriv,
  userWithItemHistory,
  userWithList,
  userWithListAndItems
} from '../test-helpers/createUser';
import { List, User, UserToList } from '../entities';
import { userListFragment } from '../test-helpers/fragments/userListFragment';
import { userListPartial } from '../test-helpers/fragments/userListPartial';
import { fieldErrorFragment } from '../test-helpers/fragments/fieldErrorFragment';
import { listPartial } from '../test-helpers/fragments/listPartial';
import { userFragment } from '../test-helpers/fragments/userFragment';
import { userListItemHistoryPartial } from '../test-helpers/fragments/userListItemHistoryPartial';

const getUsersListsQuery = `
query GetUsersLists {
  getUsersLists {
    ${userListFragment}
    ${fieldErrorFragment}
  }
}
`;

const createListMutation = `
mutation CreateList($title: String!) {
  createList (title: $title) {
    ${userListFragment}
    ${fieldErrorFragment}
  }
}
`;

const shareListMutation = `
  mutation ShareList($data: ShareListInput!) {
    shareList (data: $data) {
      boolean
      ${fieldErrorFragment}
    }
  }
`;

const deleteListMutation = `
  mutation DeleteList($listId: String!) {
    deleteList(listId: $listId) {
      boolean
      ${fieldErrorFragment}
    }
  }
`;

const renameListMutation = `
  mutation RenameList($name: String!, $listId: String!) {
    renameList(name: $name, listId: $listId) {
      ${listPartial}
      ${fieldErrorFragment}
    }
  }
`;

const sortListsMutation = `
  mutation SortLists($data: StringArrayInput!) {
    sortLists(data: $data) 
      ${userFragment}
    
  }
`;

const sortItemsMutation = `
  mutation SortItems($data: StringArrayInput!, $listId: String!) {
    sortItems(data: $data, listId: $listId) {
      ${userListPartial}
      ${fieldErrorFragment}
    }
  }
`;

export const submitRemovalOrderMutation = `
  mutation SubmitRemovalOrder($data: RemovalOrderInput!) {
    submitRemovalOrder(data: $data) {
      ${userListItemHistoryPartial}
      ${fieldErrorFragment}
    }
  }
`;

describe('Get users lists query:', () => {
  it('Fetches all the current users lists', async () => {
    const user = await userWithList();

    const response = await graphqlCall({
      source: getUsersListsQuery,
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        getUsersLists: {
          userToList: [
            {
              list: {
                title: 'my-test-list-0'
              }
            }
          ]
        }
      }
    });
  });

  it('Unauthorized response with no userId in context', async () => {
    const response = await graphqlCall({
      source: getUsersListsQuery
    });

    expect(response).toMatchObject({
      data: {
        getUsersLists: {
          errors: [
            {
              field: 'context',
              message: 'Context contains no userId..'
            }
          ]
        }
      }
    });
  });
});

describe('Create list mutation:', () => {
  it('User with authenticated userId context can create a list', async () => {
    const userId = (await createUser()).id; // Creates user with no lists
    const title = faker.name.title();

    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: title },
      userId: userId
    });

    expect(response).toMatchObject({
      data: {
        createList: {
          userToList: [
            {
              list: {
                title: title
              }
            }
          ]
        }
      }
    });

    const listConnectionsInDatabase = await UserToList.find({
      where: { userId: userId }
    });

    // User will now have one list connection in the database
    expect(listConnectionsInDatabase).toBeDefined();
    expect(listConnectionsInDatabase).toHaveLength(1);
  });

  it('User cannot create more than 25 lists as owner', async () => {
    const user = await userWithList(25); // creates user with 25 lists
    const title = faker.name.title();

    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: title },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        createList: {
          errors: [
            {
              field: 'lists',
              message: 'User cannot create more than 25 lists..'
            }
          ]
        }
      }
    });

    const listConnectionsInDatabase = await UserToList.find({
      where: { userId: user.id }
    });

    expect(listConnectionsInDatabase).toHaveLength(25);
  });

  it('Unauthorized response with no userId in context', async () => {
    const response = await graphqlCall({
      source: createListMutation,
      variableValues: { title: faker.name.title() }
    });

    expect(response).toMatchObject({
      data: {
        createList: {
          errors: [
            {
              field: 'context',
              message: 'Context contains no userId..'
            }
          ]
        }
      }
    });
  });
});

describe('Share list mutation:', () => {
  it('Owner of the list can share the list', async () => {
    const user = await userWithList();
    const userToShare = await createUser();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });

    const shareListInput = {
      email: userToShare.email,
      listId: userToListTable!.listId,
      privileges: ['add', 'strike']
    };

    const response = await graphqlCall({
      source: shareListMutation,
      variableValues: { data: shareListInput },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        shareList: {
          boolean: true
        }
      }
    });
  });

  it('Non-owners cannot share the list', async () => {
    const listOwner = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const sharedUser = await createUserWithSharedPriv(userToListTable!.listId, [
      'add',
      'strike'
    ]);
    const userToShare = await createUser();

    const shareListInput = {
      email: userToShare.email,
      listId: userToListTable!.listId,
      privileges: ['delete']
    };

    const response = await graphqlCall({
      source: shareListMutation,
      variableValues: { data: shareListInput },
      userId: sharedUser.id
    });

    expect(response).toMatchObject({
      data: {
        shareList: {
          errors: [
            {
              message: 'User does not have rights to share that list..'
            }
          ]
        }
      }
    });

    // New connection in database should not exist 👎
    const userToShareListConnection = await UserToList.findOne({
      where: { userId: userToShare.id }
    });
    expect(userToShareListConnection).toBeUndefined();
  });
});

describe('Delete list mutation:', () => {
  it('User can delete their UserToList connection, list is deleted when no other connections exist', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });

    const response = await graphqlCall({
      source: deleteListMutation,
      variableValues: { listId: userToListTable!.listId },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteList: {
          boolean: true
        }
      }
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter).toBeUndefined();

    // List no longer exists
    const listInDatabaseAfter = await List.findOne(userToListTable!.listId);
    expect(listInDatabaseAfter).toBeUndefined();
  });

  it('List infers a new owner when owner of list deletes connection and list has existing connections', async () => {
    const listOwner = await userWithList();
    const ownersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const listId = ownersUserToListTable!.listId;
    const sharedUser = await createUserWithSharedPriv(listId, [
      'add',
      'strike',
      'delete'
    ]);

    const response = await graphqlCall({
      source: deleteListMutation,
      variableValues: { listId: listId },
      userId: listOwner.id
    });

    expect(response).toMatchObject({
      data: {
        deleteList: {
          boolean: true
        }
      }
    });

    const sharedUserToListTableAfter = await UserToList.findOne({
      where: { userId: sharedUser.id }
    });

    // List has new owner
    expect(sharedUserToListTableAfter).toMatchObject({
      privileges: ['owner']
    });
  });

  it('Delete list cannot be used by unauthenticated requests', async () => {
    // User must have authenticated context to target a list connection
    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });
    const listId = userToListTable!.listId;

    const response = await graphqlCall({
      source: deleteListMutation,
      variableValues: { listId: listId },
      userId: undefined
    });

    expect(response).toMatchObject({
      data: {
        deleteList: {
          errors: [
            {
              field: 'context',
              message: 'Context contains no userId..'
            }
          ]
        }
      }
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter).toBeDefined();
  });
});

describe('Rename list mutation:', () => {
  it('Owner of list can rename the list', async () => {
    const listOwner = await userWithList();
    const ownersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const listId = ownersUserToListTable!.listId;
    const newListName = faker.name.jobArea();

    const response = await graphqlCall({
      source: renameListMutation,
      variableValues: { name: newListName, listId: listId },
      userId: listOwner.id
    });

    expect(response).toMatchObject({
      data: {
        renameList: {
          list: {
            title: newListName
          }
        }
      }
    });

    // New list name is saved to database
    const listInDatabaseAfter = await List.findOne(listId);
    expect(listInDatabaseAfter!.title).toBe(newListName);
  });

  it('Non-owners cannot rename the list', async () => {
    const listOwner = await userWithList();
    const ownersUserToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const listId = ownersUserToListTable!.listId;
    const newListName = faker.name.jobArea();

    const sharedUser = await createUserWithSharedPriv(listId, [
      'add',
      'delete'
    ]);

    const response = await graphqlCall({
      source: renameListMutation,
      variableValues: { name: newListName, listId: listId },
      userId: sharedUser.id
    });

    expect(response).toMatchObject({
      data: {
        renameList: {
          errors: [
            {
              field: 'userToList',
              message: 'User does not have rights to rename that list..'
            }
          ]
        }
      }
    });

    // New list name is NOT saved to database
    const listInDatabaseAfter = await List.findOne(listId);
    expect(listInDatabaseAfter!.title).toBe('my-test-list-0');
  });
});

describe('Sort list mutation:', () => {
  it('User can sort the order of in which their lists are displayed', async () => {
    const user = await userWithList(4);
    const userToListTableArray = await UserToList.find({
      where: { userId: user.id }
    });
    const listIdArray = userToListTableArray.map((table) => table.listId);

    const userBefore = await User.findOne(user.id);
    expect(userBefore!.sortedListsArray).toBeNull();

    const reversedListIdArray = listIdArray.reverse();

    const response = await graphqlCall({
      source: sortListsMutation,
      variableValues: { data: { stringArray: reversedListIdArray } },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        sortLists: {
          user: {
            sortedListsArray: reversedListIdArray,
            email: user.email,
            id: user.id,
            username: user.username
          }
        }
      }
    });

    const userAfter = await User.findOne(user.id);
    expect(userAfter!.sortedListsArray).toMatchObject(reversedListIdArray);
  });
});

describe('Re-order list mutation:', () => {
  it('User can submit their re-ordered list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });
    expect(userToListTable!.sortedItems).toBeNull();

    const itemNameArray = userToListTable!.list.items!.map((item) => item.name);
    expect(itemNameArray).toHaveLength(5);
    const reversedItemArray = itemNameArray!.reverse();

    const response = await graphqlCall({
      source: sortItemsMutation,
      variableValues: {
        data: { stringArray: reversedItemArray },
        listId: userToListTable!.listId
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        sortItems: {
          userToList: [
            {
              sortedItems: reversedItemArray
            }
          ]
        }
      }
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter!.sortedItems).toMatchObject(reversedItemArray);
  });
});

// Submit and merge removalOrder results for Auto-Sort feature
describe('Submit removal order mutation:', () => {
  it('User can save an array of items removed into a removalRatingArray, api returns average rating for each item', async () => {
    const user = await userWithItemHistory();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
    expect(userToListTable!.itemHistory![0].removalRatingArray).toBeNull;

    const itemNameArray = userToListTable!.list.items!.map((item) => item.name);
    expect(itemNameArray).toHaveLength(10);

    const response = await graphqlCall({
      source: submitRemovalOrderMutation,
      variableValues: {
        data: {
          removedItemArray: itemNameArray,
          listId: userToListTable!.listId
        }
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        submitRemovalOrder: {
          userToList: [
            {
              itemHistory: [
                {
                  item: itemNameArray[0],
                  removalRating: 0
                },
                {
                  item: itemNameArray[1],
                  removalRating: 100
                },
                {
                  item: itemNameArray[2],
                  removalRating: 200
                },
                {
                  item: itemNameArray[3],
                  removalRating: 300
                },
                {
                  item: itemNameArray[4],
                  removalRating: 400
                },
                {
                  item: itemNameArray[5],
                  removalRating: 500
                },
                {
                  item: itemNameArray[6],
                  removalRating: 600
                },
                {
                  item: itemNameArray[7],
                  removalRating: 700
                },
                {
                  item: itemNameArray[8],
                  removalRating: 800
                },
                {
                  item: itemNameArray[9],
                  removalRating: 900
                }
              ]
            }
          ]
        }
      }
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['itemHistory']
    });
    expect(
      userToListTableAfter!.itemHistory![0].removalRatingArray
    ).toHaveLength(1);
    expect(
      userToListTableAfter!.itemHistory![0].removalRatingArray
    ).toStrictEqual(['0']);
    expect(
      userToListTableAfter!.itemHistory![1].removalRatingArray
    ).toStrictEqual(['100']);
    expect(
      userToListTableAfter!.itemHistory![9].removalRatingArray
    ).toStrictEqual(['900']);
  });

  it('Pushes item in index 0 off the list to store only recent ratings', async () => {
    const user = await userWithItemHistory(true);
    // Returns user with unique rating at index 0
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
    const itemNameArray = userToListTable!.list
      .items!.map((item) => item.name)
      .reverse(); // reverse to submit in correct order
    const removalRatingAtIndexZero = userToListTable!.itemHistory![0]
      .removalRatingArray![0];

    await graphqlCall({
      source: submitRemovalOrderMutation,
      variableValues: {
        data: {
          removedItemArray: itemNameArray,
          listId: userToListTable!.listId
        }
      },
      userId: user.id
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['itemHistory']
    });
    const isRatingOnList = userToListTableAfter!.itemHistory![0].removalRatingArray!.find(
      (rating) => rating === removalRatingAtIndexZero
    );

    expect(isRatingOnList).toBeUndefined();
  });
});
