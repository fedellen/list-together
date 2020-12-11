import { graphqlCall } from '../helpers/graphqlCall';
import faker from 'faker';
import {
  createUser,
  createUserWithSharedPriv,
  userWithList
} from '../helpers/createUser';
import { List, UserToList } from '../../entities';
import { userListFragment } from '../helpers/userListFragment';

const getUsersListsQuery = `
query GetUsersLists {
  getUsersLists
  ${userListFragment}
}
`;

const createListMutation = `
mutation CreateList($title: String!) {
  createList (title: $title) {
    title
    id
  }
}
`;

const shareListMutation = `
  mutation ShareList($data: ShareListInput!) {
    shareList (data: $data)
  }
`;

const deleteListMutation = `
  mutation DeleteList($listId: String!) {
    deleteList(listId: $listId)
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
        getUsersLists: [
          {
            list: {
              title: 'my-test-list-0'
            }
          }
        ]
      }
    });
  });

  it('Unauthorized response with no userId in context', async () => {
    const response = await graphqlCall({
      source: getUsersListsQuery
    });

    expect(response).toMatchObject({
      errors: [
        {
          message: 'Not authenticated..'
        }
      ]
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
          title: title
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
      errors: [
        {
          message: 'User cannot create more than 25 lists..'
        }
      ]
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
      errors: [
        {
          message: 'Not authenticated..'
        }
      ]
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
        shareList: true
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
      errors: [
        {
          message: 'You do not have owner privileges to that list..'
        }
      ]
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
    const user = await userWithList();
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
        deleteList: true
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
        deleteList: true
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
      errors: [
        {
          message: 'Not authenticated..'
        }
      ]
    });

    const userToListTableAfter = await UserToList.findOne({
      where: { userId: user.id }
    });
    expect(userToListTableAfter).toBeDefined();
  });
});

// describe('Rename list mutation:', () => {
//   it('Owner of list can rename the list', () => {});

//   it('Non-owners cannot rename the list', () => {});
// });

// describe('Sort list mutation:', () => {
//   it('User can sort the order of in which their lists are displayed', () => {});

//   it('Non-owners cannot rename the list', () => {});
// });

// describe('Re-order list mutation:', () => {
//   it('User can submit a re-ordered list', () => {});

//   it('User can automatically re-order the list', () => {});

//   it('When user recieves a list with new items, the new items are presented at the top of their Sorted List', () => {});
// });
