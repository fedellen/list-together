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
  } else if (validatePrivilege && userToList.privileges !== 'owner') {
    const privileges = userToList.privileges;
    let privilegeError = false;
    switch (validatePrivilege) {
      case 'add':
        if (privileges === 'read') privilegeError = true;
        break;

      case 'strike':
        if (privileges === 'read' || privileges === 'add')
          privilegeError = true;
        break;

      case 'delete':
        if (
          privileges === 'read' ||
          privileges === 'add' ||
          privileges === 'strike'
        )
          privilegeError = true;
        break;

      case 'owner':
        privilegeError = true;
        break;

      default:
        break;
    }

    // if (validatePrivilege === 'add') {
    //   if (privileges === 'read') privilegeError = true
    // } else if (validatePrivilege === 'strike') {
    //   if (privileges === 'read' || privileges === 'add') privilegeError = true
    // } else if (validatePrivilege === 'strike')

    if (privilegeError) {
      return [
        {
          field: 'privileges',
          message: `User does not have the correct "${validatePrivilege}" privilege..`
        }
      ];
    }
  }

  return null;
};
