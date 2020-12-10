import { List, User, UserToList } from '../../entities';
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
