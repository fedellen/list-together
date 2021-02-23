import { User } from '../../entities';
import { createNewUser } from './createNewUser';

export const getOrCreateUserByEmail = async (email: string): Promise<User> => {
  // Look for existing user
  let user = await User.findOne({ where: { email: email } });
  if (!user) {
    // Email not found in the database, create a new user
    user = await createNewUser(email);
  }
  return user;
};
