import { UserPrivileges, UserToList } from '../../entities';
import { MyContext } from '../../MyContext';
import { FieldError } from '../../resolvers/types/response/FieldError';
import { validateContext } from '../../resolvers/types/validators/validateContext';
import { validateUserToList } from '../../resolvers/types/validators/validateUserToList';

type UserToTableRelations = 'list' | 'list.items' | 'itemHistory';

type GetUserListTableArgs = {
  context: MyContext;
  listId?: string;
  relations?: UserToTableRelations[];
  validateItemsExist?: boolean;
  validatePrivilege?: UserPrivileges;
};

type GetUserListTablePayload = {
  userToList?: UserToList[];
  errors?: FieldError[];
};

export const getUserListTable = async ({
  context,
  listId,
  relations,
  validateItemsExist,
  validatePrivilege
}: GetUserListTableArgs): Promise<GetUserListTablePayload> => {
  const contextErrors = validateContext(context);
  if (contextErrors) return { errors: contextErrors };
  const userId = context.req.session.userId;

  // Get list(s)
  const userToListTable = await UserToList.find({
    where: listId ? { listId, userId } : { userId },
    relations: relations || []
  });

  const userListErrors = validateUserToList({
    // Validation is only required on singular list calls
    // So we only need to check the list at index [0]
    userToList: userToListTable[0],
    validatePrivilege: validatePrivilege || undefined,
    validateItemsExist: validateItemsExist
  });
  if (userListErrors) return { errors: userListErrors };
  else if (!userToListTable)
    // UserToList should be valid if no errors
    throw new Error('UserList validation error on `getUserListTable`..');

  return { userToList: userToListTable };
};
