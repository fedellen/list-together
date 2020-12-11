import { Item, List, User, UserPrivileges, UserToList } from '../../entities';
import faker from 'faker';
import argon2 from 'argon2';

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
      name: faker.name.jobDescriptor()
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

// export const userWithoutOwnerAccess = async (): Promise<User> => {
//   const user = await createUser
// }
