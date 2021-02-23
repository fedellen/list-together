import { List, User, UserToList } from '../../entities';

export const createNewUser = async (email: string): Promise<User> => {
  // Create new user's first list
  const initialList = await List.create({
    title: 'my-list'
  }).save();
  // Create the user table with [listId]
  const user = await User.create({
    email: email,
    sortedListsArray: [initialList.id]
  }).save();
  // Create the initial UserToList connection Table
  await UserToList.create({
    listId: initialList.id,
    userId: user.id,
    privileges: 'owner',
    list: initialList
  }).save();

  return user;
};
