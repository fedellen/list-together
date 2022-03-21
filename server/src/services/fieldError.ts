import { UserPrivileges } from '../entities';
import { maxCharacterLimit, minCharacterLimit } from '../constants';
import {
  FieldError,
  isFieldError
} from '../resolvers/types/response/FieldError';

const noUserInContext: FieldError = {
  field: 'context',
  message: 'Context contains no userId..'
};

const itemAlreadyExists: FieldError = {
  field: 'name',
  message: 'Item already exists on this list..'
};

const nameIsTooShort: FieldError = {
  field: 'text',
  message: `Text entry cannot contain less than ${minCharacterLimit} character${
    minCharacterLimit === 1 ? '' : 's'
  }...`
};

const nameIsTooLong: FieldError = {
  field: 'text',
  message: `Text entry cannot contain more than ${maxCharacterLimit} characters...`
};

const userToListTableDoesNotExist: FieldError = {
  field: 'list',
  message: 'That list connection could not be found..'
};

const noItemsOnThatList: FieldError = {
  field: 'items',
  message: 'That list connection does not have any items..'
};

const insufficientPrivileges: (priv: UserPrivileges) => FieldError = (priv) => {
  return {
    field: 'privileges',
    message: `User does not have the correct "${priv}" privilege..`
  };
};

export function parseErrorIntoFieldError(err: unknown): FieldError {
  if (isFieldError(err)) {
    return err;
  }

  if (err instanceof Error) {
    return { field: err.name, message: err.message };
  }

  if (typeof err === 'string') {
    return { field: 'Unknown String Exception', message: err };
  }

  return {
    field: 'Unknown Exception',
    message: err as any
  };
}

export default {
  noUserInContext,
  itemAlreadyExists,
  nameIsTooLong,
  nameIsTooShort,
  userToListTableDoesNotExist,
  noItemsOnThatList,
  insufficientPrivileges
};
