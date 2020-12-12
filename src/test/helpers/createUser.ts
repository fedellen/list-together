import { Item, List, User, UserPrivileges, UserToList } from '../../entities';
import faker from 'faker';
import argon2 from 'argon2';
import { graphqlCall } from './graphqlCall';
import { submitRemovalOrderMutation } from '../resolvers/list.test';
import { addItemMutation } from '../resolvers/item.test';

export const createUser = async (confirmed: boolean = true): Promise<User> => {
  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    confirmed: confirmed
  };

  const hashedPassword = await argon2.hash(user.password);
  const savedUser = await User.create({
    ...user,
    password: hashedPassword
  }).save();

  // Return non-hashed password for testing
  savedUser.password = user.password;

  return savedUser;
};

export const userWithList = async (lists: number = 1): Promise<User> => {
  const user = await createUser();
  for (let i = 0; i < lists; i++) {
    const list = await List.create({
      title: `my-test-list-${i}`
    }).save();
    await UserToList.create({
      listId: list.id,
      userId: user.id,
      privileges: ['owner']
    }).save();
  }

  return user;
};

export const userWithListAndItems = async (
  items: number = 5
): Promise<User> => {
  const user = await userWithList();
  const userToListTable = await UserToList.findOne({
    where: { userId: user.id },
    relations: ['list', 'list.items']
  });

  for (let i = 0; i < items; i++) {
    const newItem = Item.create({
      name: faker.name.firstName()
    });
    if (userToListTable!.list.items) {
      userToListTable!.list.items = [...userToListTable!.list.items, newItem];
    } else {
      userToListTable!.list.items = [newItem];
    }
  }
  await userToListTable!.save();
  return user;
};

export const createUserWithSharedPriv = async (
  listId: string,
  privileges: UserPrivileges[]
): Promise<User> => {
  const user = await createUser();
  await UserToList.create({
    listId: listId,
    userId: user.id,
    privileges: privileges
  }).save();

  return user;
};

export const userWithItemHistory = async (
  full: boolean = false
): Promise<User> => {
  const user = await userWithList();
  const userToListTable = await UserToList.findOne({
    where: { userId: user.id }
  });
  const listId = userToListTable!.listId;

  // Add 10 items
  for (let i = 0; i < 10; i++) {
    const newItem = faker.name.firstName();
    await graphqlCall({
      source: addItemMutation,
      variableValues: { listId: listId, name: newItem },
      userId: user.id
    });
  }

  if (full) {
    // Add orginal array to removalOrder
    const newUserToListTable = await UserToList.findOne({
      where: { userId: user.id },
      relations: ['list', 'list.items']
    });
    const itemNameArray = newUserToListTable!.list.items!.map(
      (item) => item.name
    );
    await graphqlCall({
      source: submitRemovalOrderMutation,
      variableValues: {
        data: {
          removedItemArray: itemNameArray,
          listId: listId
        }
      },
      userId: user.id
    });

    // Add reversed order 9 times
    const reversedItemNameArray = itemNameArray.reverse();
    for (let i = 0; i < 9; i++) {
      await graphqlCall({
        source: submitRemovalOrderMutation,
        variableValues: {
          data: {
            removedItemArray: reversedItemNameArray,
            listId: listId
          }
        },
        userId: user.id
      });
    }
  }

  return user;
};

// export const userWithoutOwnerAccess = async (): Promise<User> => {
//   const user = await createUser
// }
