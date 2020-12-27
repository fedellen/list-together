import { graphqlCall } from '../test-helpers/graphqlCall';
import {
  createUserWithSharedPriv,
  userWithList,
  userWithListAndItems
} from '../test-helpers/createUser';
import { UserToList } from '../entities';
import faker from 'faker';
import { userListFragment } from '../test-helpers/fragments/userListFragment';
import { fieldErrorFragment } from '../test-helpers/fragments/fieldErrorFragment';
// import { listPartial } from '../test-helpers/fragments/listPartial';
import { listFragment } from '../test-helpers/fragments/listFragment';
import { itemFragment } from '../test-helpers/fragments/itemFragment';

const addItemMutation = `
mutation AddItem($data: AddItemInput!) {
  addItem(data: $data) {
    ${userListFragment} 
    ${fieldErrorFragment}
  }
}
`;

const deleteItemsMutation = `
mutation DeleteItems($data: DeleteItemsInput!) {
  deleteItems(data: $data) {
    ${listFragment} 
    ${fieldErrorFragment}
  }
}
`;

const styleItemMutation = `
mutation StyleItem($data: StyleItemInput!) {
  styleItem(data: $data) {
    item {
      ${itemFragment}
    }
    ${fieldErrorFragment}
  }
}
`;

const renameItemMutation = `
mutation RenameItem($data: RenameItemInput!) {
  renameItem(data: $data) {
    item {
      ${itemFragment}
    }
    ${fieldErrorFragment}
  }
}
`;

const addNoteMutation = `
mutation AddNote($data: AddNoteInput!) {
  addNote(data: $data) {
    item {
      ${itemFragment}
    } 
    ${fieldErrorFragment}
  }
}
`;

describe('Add item mutation:', () => {
  it('Owner of list can add items to the list', async () => {
    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });
    const itemName = faker.name.jobDescriptor();

    const response = await graphqlCall({
      source: addItemMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          nameInput: itemName
        }
      },
      userId: user.id
    });

    // Check response format, has item name
    expect(response).toMatchObject({
      data: {
        addItem: {
          userToList: [
            {
              list: {
                items: [
                  {
                    name: itemName
                  }
                ]
              }
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });

    // Item is on list in database with default attributes
    expect(listConnectionInDatabase!.list.items).toMatchObject([
      {
        name: itemName,
        strike: false,
        bold: false,
        notes: null
      }
    ]);

    // Item history correctly records the new item
    expect(listConnectionInDatabase!.itemHistory).toMatchObject([
      {
        item: itemName,
        timesAdded: 1,
        removalRatingArray: null
      }
    ]);
  });

  // it('User who has shared `add` privilege can add item', () => {});

  // it('User with list access without `add` privileges cannot add item', () => {});

  it('Add Item gives unauthorized response with no userId in context', async () => {
    await userWithList(); // Creates one list in database

    const allUserLists = await UserToList.find({});
    const itemName = faker.name.jobDescriptor();

    // Unauthorized client sending request to list

    const response = await graphqlCall({
      source: addItemMutation,
      variableValues: {
        data: {
          listId: allUserLists[0].listId,
          nameInput: itemName
        }
      },
      userId: undefined
    });

    expect(response).toMatchObject({
      data: {
        addItem: {
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

describe('Delete items mutation:', () => {
  it('User can delete items from their own list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);

    // Set sorted items array for testing
    userToListTable!.sortedItems = itemNameArray;
    await userToListTable!.save();

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemNameArray: [itemNameArray[0], itemNameArray[1]]
        }
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: null,
          list: {
            items: [
              {
                name: itemNameArray[2]
              },
              {
                name: itemNameArray[3]
              },
              {
                name: itemNameArray[4]
              }
            ]
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    // List array without [0] and [1]
    expect(listConnectionInDatabase!.list.items![0].name).toBe(
      itemNameArray[2]
    );
    expect(listConnectionInDatabase!.list.items![1].name).toBe(
      itemNameArray[3]
    );
    expect(listConnectionInDatabase!.list.items![2].name).toBe(
      itemNameArray[4]
    );

    // Check sorted items array
    expect(listConnectionInDatabase!.sortedItems![0]).toBe(itemNameArray[2]);
    expect(listConnectionInDatabase!.sortedItems![1]).toBe(itemNameArray[3]);
    expect(listConnectionInDatabase!.sortedItems![2]).toBe(itemNameArray[4]);
  });

  it('Non-existing item conflicts are handled in backend, still deletes remaining items from request', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);

    // Set sorted items array for testing
    userToListTable!.sortedItems = itemNameArray;
    await userToListTable!.save();

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemNameArray: ['fakeItemName', itemNameArray[0], itemNameArray[1]]
        }
      },
      userId: user.id
    });

    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: [
            {
              field: 'itemName',
              message: 'Item "fakeItemName" was not found on the list..'
            }
          ],
          list: {
            items: [
              {
                name: itemNameArray[2]
              },
              {
                name: itemNameArray[3]
              },
              {
                name: itemNameArray[4]
              }
            ]
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    // List array without [0] and [1]
    expect(listConnectionInDatabase!.list.items![0].name).toBe(
      itemNameArray[2]
    );
    expect(listConnectionInDatabase!.list.items![1].name).toBe(
      itemNameArray[3]
    );
    expect(listConnectionInDatabase!.list.items![2].name).toBe(
      itemNameArray[4]
    );
  });

  it('User with shared `delete` privileges can delete items from list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['delete']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemNameArray: [itemNameArray[2], itemNameArray[3], itemNameArray[4]]
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has item name
    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: null,
          list: {
            items: [
              {
                name: itemNameArray[0]
              },
              {
                name: itemNameArray[1]
              }
            ]
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    // List array without [0] and [1]
    expect(listConnectionInDatabase!.list.items![0].name).toBe(
      itemNameArray[0]
    );
    expect(listConnectionInDatabase!.list.items![1].name).toBe(
      itemNameArray[1]
    );
  });
  it('User without shared `delete` privileges cannot delete items from list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['add', 'strike']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: deleteItemsMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemNameArray: [itemNameArray[3]]
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has item name
    expect(response).toMatchObject({
      data: {
        deleteItems: {
          errors: [
            {
              field: 'userId',
              message:
                'User does not have privileges to delete items from that list..'
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    // List array without [0] and [1]
    expect(listConnectionInDatabase!.list.items![0].name).toBe(
      itemNameArray[0]
    );
    expect(listConnectionInDatabase!.list.items![1].name).toBe(
      itemNameArray[1]
    );
    expect(listConnectionInDatabase!.list.items![2].name).toBe(
      itemNameArray[2]
    );
    expect(listConnectionInDatabase!.list.items![3].name).toBe(
      itemNameArray[3]
    );
    expect(listConnectionInDatabase!.list.items![4].name).toBe(
      itemNameArray[4]
    );
  });
});

describe('Style item mutation:', () => {
  it('User can bold and strike items from their own list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);

    const responseBold = await graphqlCall({
      source: styleItemMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemNameArray[0],
          style: 'bold',
          isStyled: true
        }
      },
      userId: user.id
    });

    // Check response format, has bold
    expect(responseBold).toMatchObject({
      data: {
        styleItem: {
          item: {
            bold: true
          }
        }
      }
    });

    const responseStrike = await graphqlCall({
      source: styleItemMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemNameArray[1],
          style: 'strike',
          isStyled: true
        }
      },
      userId: user.id
    });

    // Check response format, has bold
    expect(responseStrike).toMatchObject({
      data: {
        styleItem: {
          item: {
            strike: true
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[0]
      )!.bold
    ).toBeTruthy();
    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[1]
      )!.strike
    ).toBeTruthy();
  });

  it('User with access to the list can bold items', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['add']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: styleItemMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[3],
          style: 'bold',
          isStyled: true
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        styleItem: {
          item: {
            bold: true
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[3]
      )!.bold
    ).toBeTruthy();
  });

  it('User with shared `strike` privileges can strike items from list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['strike']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: styleItemMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[2],
          style: 'strike',
          isStyled: true
        }
      },
      userId: sharedUser.id
    });

    // Check response format
    expect(response).toMatchObject({
      data: {
        styleItem: {
          item: {
            strike: true
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[2]
      )!.strike
    ).toBeTruthy();
  });

  it('User without shared `strike` privileges cannot strike items from list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['add']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );

    const response = await graphqlCall({
      source: styleItemMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[1],
          style: 'strike',
          isStyled: true
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        styleItem: {
          errors: [
            {
              field: 'userId',
              message:
                'User does not have privileges to strike items from that list..'
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[1]
      )!.strike
    ).toBeFalsy();
  });
});

describe('Add note mutation:', () => {
  it('User can add notes to items items own their own list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);
    const noteToAdd = faker.name.jobTitle();

    const response = await graphqlCall({
      source: addNoteMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemNameArray[0],
          note: noteToAdd
        }
      },
      userId: user.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        addNote: {
          item: {
            notes: [noteToAdd]
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[0]
      )!.notes![0]
    ).toBe(noteToAdd);
  });

  it('User with shared `add` privileges can add notes to items on the list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['add']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );
    const noteToAdd = faker.name.jobTitle();

    const response = await graphqlCall({
      source: addNoteMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[1],
          note: noteToAdd
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        addNote: {
          item: {
            notes: [noteToAdd]
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[1]
      )!.notes![0]
    ).toBe(noteToAdd);
  });

  it('User without shared `add` privileges cannot add notes to items on the list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['strike', 'delete']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );
    const noteToAdd = faker.name.jobTitle();

    const response = await graphqlCall({
      source: addNoteMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[2],
          note: noteToAdd
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        addNote: {
          errors: [
            {
              message:
                'User does not have privileges to add notes to items on that list..'
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list.items!.find(
        (i) => i.name === itemNameArray[2]
      )!.notes
    ).toBeNull();
  });
});

describe('Rename item mutation:', () => {
  it('User can rename items on own their own list', async () => {
    const user = await userWithListAndItems();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    const itemNameArray = userToListTable!.list.items!.map((i) => i.name);
    const newItemName = faker.name.lastName();

    const response = await graphqlCall({
      source: renameItemMutation,
      variableValues: {
        data: {
          listId: userToListTable!.listId,
          itemName: itemNameArray[0],
          newName: newItemName
        }
      },
      userId: user.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        renameItem: {
          item: {
            name: newItemName
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list
        .items!.map((i) => i.name)
        .includes(newItemName)
    ).toBeTruthy();
  });

  it('User with shared `add` privileges can rename items on the list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['add']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );
    const newItemName = faker.name.lastName();

    const response = await graphqlCall({
      source: renameItemMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[1],
          newName: newItemName
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        renameItem: {
          item: {
            name: newItemName
          }
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list
        .items!.map((i) => i.name)
        .includes(newItemName)
    ).toBeTruthy();
  });

  it('User without shared `add` privileges cannot remame items on the list', async () => {
    const listOwner = await userWithListAndItems();
    const listOwnerUserConnection = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });
    const sharedUser = await createUserWithSharedPriv(
      listOwnerUserConnection!.listId,
      ['strike']
    );

    const itemNameArray = listOwnerUserConnection!.list.items!.map(
      (i) => i.name
    );
    const newItemName = faker.name.lastName();

    const response = await graphqlCall({
      source: renameItemMutation,
      variableValues: {
        data: {
          listId: listOwnerUserConnection!.listId,
          itemName: itemNameArray[2],
          newName: newItemName
        }
      },
      userId: sharedUser.id
    });

    // Check response format, has bold
    expect(response).toMatchObject({
      data: {
        renameItem: {
          errors: [
            {
              message:
                'User does not have privileges to rename items on that list..'
            }
          ]
        }
      }
    });

    const listConnectionInDatabase = await UserToList.findOne({
      where: { userId: listOwner.id },
      relations: ['list', 'list.items']
    });

    expect(
      listConnectionInDatabase!.list
        .items!.map((i) => i.name)
        .includes(newItemName)
    ).toBeFalsy();
  });
});
