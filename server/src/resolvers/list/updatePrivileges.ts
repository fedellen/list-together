import { UserToList, User } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { UpdatePrivilegesInput } from '../types/input/UpdatePrivilegesInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { validateContext } from '../types/validators/validateContext';
import { validatePrivilegeType } from '../types/validators/validatePrivilegeType';
import { validateUserToList } from '../types/validators/validateUserToList';

@Resolver()
export class UpdatePrivilegesResolver {
  // Update shared user's privileges
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async updatePrivileges(
    @Arg('data') data: UpdatePrivilegesInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

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

    const userToUpdate = await User.findOne({ where: { email: data.email } });
    if (!userToUpdate) {
      return {
        errors: [
          {
            field: 'email',
            message: 'A user with that email address does not exist..'
          }
        ]
      };
    }

    const sharedUserToListTable = await UserToList.findOne({
      where: { listId: data.listId, userId: userToUpdate.id },
      relations: ['list']
    });
    if (!sharedUserToListTable) {
      return {
        errors: [
          {
            field: 'email',
            message:
              'A user with that email address does not have access to that list..'
          }
        ]
      };
    }

    if (!data.privileges) {
      /** If no privileges are specified, remove all access from sharedUser */
      await sharedUserToListTable.remove();
      await publish({
        updatedListId: sharedUserToListTable.listId,
        userIdToShare: sharedUserToListTable.userId,
        notification: `Your access to list: "${sharedUserToListTable.list.title}" has been removed`
      });
    } else {
      const privilegeTypeError = validatePrivilegeType(data.privileges);
      if (privilegeTypeError) return { errors: privilegeTypeError };

      sharedUserToListTable.privileges = data.privileges;
      await sharedUserToListTable.save();
      await publish({
        updatedListId: sharedUserToListTable?.listId,
        userIdToShare: sharedUserToListTable?.userId,
        notification: `Your privilege level for list: "${sharedUserToListTable.list.title}" has been changed to ${sharedUserToListTable.privileges}`
      });
    }
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
