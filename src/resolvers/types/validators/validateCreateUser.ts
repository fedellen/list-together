import { User } from '../../../entities';
import { CreateUserInput } from '../input/CreateUserInput';

export const validateCreateUser = async (options: CreateUserInput) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'Invalid email..'
      }
    ];
  }

  if (options.email.length <= 5) {
    return [
      {
        field: 'email',
        message: 'Invalid email..'
      }
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'Length must be greater than 3..'
      }
    ];
  }

  if (options.password.length <= 3) {
    return [
      {
        field: 'password',
        message: 'Length must be greater than 3..'
      }
    ];
  }

  const emailExists = await User.findOne({ where: { email: options.email } });

  if (emailExists) {
    return [
      {
        field: 'email',
        message: 'Email address already exists in database..'
      }
    ];
  }

  return null;
};
