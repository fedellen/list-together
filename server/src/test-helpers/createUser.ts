import {
  Item,
  ItemHistory,
  List,
  User,
  UserPrivileges,
  UserToList
} from '../entities';
import faker from 'faker';
import argon2 from 'argon2';
import { sortIntoList } from '../utils/sortIntoList';

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
  let userToListTable = await UserToList.findOne({
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
    // Add to sorted items
    userToListTable = sortIntoList(userToListTable!, newItem.name);
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
    where: { userId: user.id },
    relations: ['list', 'list.items', 'itemHistory']
  });
  // const listId = userToListTable!.listId;

  if (!userToListTable) throw new Error('Big error here in createUser.ts..');

  // Add 10 items
  for (let i = 0; i < 10; i++) {
    const newItem = faker.name.firstName();
    if (userToListTable!.list.items) {
      userToListTable.list.items = [
        ...userToListTable.list.items,
        Item.create({ name: newItem })
      ];
    } else {
      userToListTable.list.items = [Item.create({ name: newItem })];
    }

    if (userToListTable.itemHistory) {
      const existingItemInHistory = userToListTable.itemHistory.find(
        ({ item }) => item === newItem
      );

      if (existingItemInHistory) {
        existingItemInHistory.timesAdded++;
      } else {
        userToListTable.itemHistory = [
          ...userToListTable.itemHistory,
          ItemHistory.create({ item: newItem })
        ];
      }
    } else {
      // Initialize item history
      userToListTable.itemHistory = [ItemHistory.create({ item: newItem })];
    }
  }

  if (full) {
    // Add orginal array to removalOrder

    if (!userToListTable.list.items || !userToListTable.itemHistory) {
      throw new Error('Another big error here in createUser.ts..');
    }

    const itemNameArray = userToListTable.list.items.map((item) => item.name);

    const arrayLengthRating = Math.round(1000 / itemNameArray.length);

    // Add orginal order 1 time
    itemNameArray.forEach((item) => {
      const itemInHistory = userToListTable.itemHistory!.find(
        (i) => i.item === item
      );
      if (!itemInHistory) throw new Error('Item has no history..');

      const newRemovalRating = Math.round(
        itemNameArray.indexOf(item) * arrayLengthRating
      ).toString(); // Save number as a string in Postgres

      let existingRemovalRatings = itemInHistory.removalRatingArray;

      if (!existingRemovalRatings) {
        itemInHistory.removalRatingArray = [newRemovalRating];
      } else {
        // Only store last 10 ratings for `recent` shopping results
        // And to prevent an infinitely scaling array of data to store 👍
        if (existingRemovalRatings.length === 10)
          existingRemovalRatings.shift();

        itemInHistory.removalRatingArray!.push(newRemovalRating);
      }
    });

    // Add reversed order 9 times
    const reversedItemNameArray = itemNameArray.reverse();
    for (let i = 0; i < 9; i++) {
      reversedItemNameArray.forEach((item) => {
        const itemInHistory = userToListTable.itemHistory!.find(
          (i) => i.item === item
        );
        if (!itemInHistory) throw new Error('Item has no history..');

        const newRemovalRating = Math.round(
          itemNameArray.indexOf(item) * arrayLengthRating
        ).toString(); // Save number as a string in Postgres

        let existingRemovalRatings = itemInHistory.removalRatingArray;

        if (!existingRemovalRatings) {
          itemInHistory.removalRatingArray = [newRemovalRating];
        } else {
          // Only store last 10 ratings for `recent` shopping results
          // And to prevent an infinitely scaling array of data to store 👍
          if (existingRemovalRatings.length === 10)
            existingRemovalRatings.shift();

          itemInHistory.removalRatingArray!.push(newRemovalRating);
        }
      });
    }
  }

  await userToListTable.save();
  return user;
};

// export const userWithoutOwnerAccess = async (): Promise<User> => {
//   const user = await createUser
// }
