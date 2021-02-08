// To strike -> list exist? -> privileges -> list has items

import { UserPrivileges, UserToList } from 'src/entities';
import { FieldError } from '../response/FieldError';

type validateUserToListArgs = {
  /** Will return error when UserToList undefined */
  userToList: UserToList | undefined;
  /** If resolver needs to mutate an item, set to true  */
  validateItemsExist?: boolean;
  /** Which (if any) privileges to check for */
  validatePrivilege?: UserPrivileges;
};

export const validateUserToList = ({
  userToList,
  validatePrivilege,
  validateItemsExist
}: validateUserToListArgs): FieldError[] | null => {
  if (!userToList) {
    return [
      {
        field: 'list',
        message: 'That list connection could not be found..'
      }
    ];
  } else if (validateItemsExist && !userToList.list.items) {
    return [
      {
        field: 'items',
        message: 'That list connection does not have any items..'
      }
    ];
  } else if (
    validatePrivilege &&
    !userToList.privileges.includes('owner') &&
    !userToList.privileges.includes(validatePrivilege)
  ) {
    return [
      {
        field: 'privileges',
        message: `User does not have the correct "${validatePrivilege}" privilege..`
      }
    ];
  }

  return null;
};
