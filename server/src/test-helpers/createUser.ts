import {
  Item,
  ItemHistory,
  List,
  User,
  UserPrivileges,
  UserToList
} from '../entities';
import faker from 'faker';
import { sortIntoList } from '../services/item/sortIntoList';

export const createUser = async (): Promise<User> => {
  const user = await User.create({
    email: faker.internet.email()
  }).save();

  return user;
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
      privileges: 'owner'
    }).save();
    // Add to sorted Lists array
    if (!user.sortedListsArray) user.sortedListsArray = [list.id];
    else user.sortedListsArray = [list.id, ...user.sortedListsArray];
  }

  return user.save();
};

/** Creates user with list and X items (default: 5) */
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
    userToListTable!.sortedItems = sortIntoList(userToListTable!, newItem.name);
  }
  await userToListTable!.save();
  return user;
};

export const userWithListAndOneItemWithNote = async (
  notes = 1
): Promise<User> => {
  const user = await userWithListAndItems(1);
  const userToListTable = await UserToList.findOne({
    where: { userId: user.id },
    relations: ['list', 'list.items']
  });
  for (let i = 0; i < notes; i++) {
    const newNote = faker.name.firstName();
    if (userToListTable!.list.items![0].notes) {
      userToListTable!.list.items![0].notes = [
        ...userToListTable!.list.items![0].notes,
        newNote
      ];
    } else {
      userToListTable!.list.items![0].notes = [newNote];
    }
  }
  await userToListTable!.save();
  return user;
};

export const createUserWithSharedPriv = async (
  listId: string,
  privileges: UserPrivileges
): Promise<User> => {
  const list = await UserToList.findOne({ where: { listId } })!;
  const { sortedItems } = list!;

  const user = await createUser();
  await UserToList.create({
    listId: listId,
    userId: user.id,
    privileges: privileges,
    sortedItems: sortedItems
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

    // Add to sortedItems
    if (userToListTable.sortedItems) {
      userToListTable.sortedItems = [...userToListTable.sortedItems, newItem];
    } else {
      userToListTable.sortedItems = [newItem];
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
