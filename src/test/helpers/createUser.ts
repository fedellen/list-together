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

export const userWithList = async (): Promise<User> => {
  const user = await createUser();
  const list = await List.create({
    title: 'my-test-list'
  }).save();
  await UserToList.create({
    listId: list.id,
    userId: user.id
  }).save();

  return user;
};
