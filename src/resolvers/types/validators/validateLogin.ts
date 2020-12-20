import { User } from '../../../entities';
import { LoginUserInput } from '../input/LoginUserInput';
import argon2 from 'argon2';

export const validateLogin = async (
  options: LoginUserInput,
  user: User | undefined
) => {
  if (!user) {
    return [
      {
        field: 'email',
        message: 'Email address does not exist in database..'
      }
    ];
  }

  if (!user.confirmed) {
    return [
      {
        field: 'email',
        message: 'Email address has not been confirmed..'
      }
    ];
  }

  const valid = await argon2.verify(user.password, options.password);
  if (!valid) {
    return [
      {
        field: 'password',
        message: 'Password is incorrect..'
      }
    ];
  }

  return null;
};
