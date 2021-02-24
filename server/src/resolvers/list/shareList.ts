import { UserToList, User } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { ShareListInput } from '../types/input/ShareListInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { validateContext } from '../types/validators/validateContext';
import { validatePrivilegeType } from '../types/validators/validatePrivilegeType';
import { validateUserToList } from '../types/validators/validateUserToList';

@Resolver()
export class ShareListResolver {
  // Share a list
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async shareList(
    @Arg('data') data: ShareListInput,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const privilegeTypeError = validatePrivilegeType(data.privileges);
    if (privilegeTypeError) return { errors: privilegeTypeError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: data.listId, userId: userId }
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'owner'
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable)
      throw new Error('UserList validation error on `shareList`..');

    const userToShare = await User.findOne({ where: { email: data.email } });
    if (!userToShare) {
      return {
        errors: [
          {
            field: 'email',
            message: 'A user with that email address does not exist..'
          }
        ]
      };
    }

    const userAlreadyHasList = await UserToList.findOne({
      where: { listId: data.listId, userId: userToShare.id },
      relations: ['list']
    });

    if (userAlreadyHasList) {
      return {
        errors: [
          {
            field: 'email',
            message: 'That email already has a connection to that list..'
          }
        ]
      };
    }

    await UserToList.create({
      listId: data.listId,
      privileges: data.privileges,
      userId: userToShare.id,
      sortedItems: userToListTable.sortedItems
    }).save();

    const userToListTableWithUpdatedSharedUsers = await UserToList.findOne({
      where: { listId: data.listId, userId: userId }
    });
    if (!userToListTableWithUpdatedSharedUsers) {
      return {
        errors: [
          {
            field: 'updatedList',
            message:
              'An unexpected error has occurred while returning list with updated sharedUsers..'
          }
        ]
      };
    }

    return { userToList: [userToListTableWithUpdatedSharedUsers] };
  }
}
