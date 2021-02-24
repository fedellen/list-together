import { UserToList, User } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { ShareListInput } from '../types/input/ShareListInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { validatePrivilegeType } from '../types/validators/validatePrivilegeType';
import { getUserListTable } from '../../services/list/getUserListTable';

@Resolver()
export class ShareListResolver {
  // Share a list
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async shareList(
    @Arg('data') { listId, privileges, email }: ShareListInput,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId,
      validatePrivilege: 'owner'
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    const privilegeTypeError = validatePrivilegeType(privileges);
    if (privilegeTypeError) return { errors: privilegeTypeError };

    const userToShare = await User.findOne({ where: { email: email } });
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
      where: { listId: listId, userId: userToShare.id },
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
      listId: listId,
      privileges: privileges,
      userId: userToShare.id,
      sortedItems: userToListTable.sortedItems
    }).save();

    const userToListTableWithUpdatedSharedUsers = await UserToList.findOne({
      where: { listId: listId, userId: userToListTable.userId }
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
