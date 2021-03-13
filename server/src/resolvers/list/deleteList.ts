import { User, UserToList, List } from '../../entities';
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
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { getUserListTable } from '../../services/list/getUserListTable';
import { UserResponse } from '../types/response/UserResponse';

@Resolver()
export class DeleteListResolver {
  @UseMiddleware(logger)
  @Mutation(() => UserResponse)
  async deleteList(
    @Arg('listId') listId: string,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserResponse> {
    const getListPayload = await getUserListTable({
      context: context,
      listId
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    const user = await User.findOne(context.req.session.userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'A user with that ID could not be found..'
          }
        ]
      };
    }

    // Remove from sortedList array
    if (user.sortedListsArray) {
      user.sortedListsArray = user.sortedListsArray.filter(
        (listId) => listId !== userToListTable.listId
      );
      await user.save();
    }
    // Remove the User to List connection
    await userToListTable.remove();

    // Handle list in database
    const listInDatabase = await List.findOne(listId, {
      relations: ['userConnection']
    });
    if (listInDatabase) {
      if (listInDatabase.userConnection.length === 0) {
        // Delete list from the database if no User Connections exist
        await listInDatabase.remove();
      } else {
        const remainingUsersArray = listInDatabase.userConnection;
        const isOwnerExist = remainingUsersArray.filter((userToList) =>
          userToList.privileges.includes('owner')
        );

        if (isOwnerExist.length === 0) {
          // If no owner of list exists, give owner privileges to first indexed user
          const newOwnerUserToListTable = await UserToList.findOne({
            where: { userId: remainingUsersArray[0].userId, listId: listId },
            relations: ['list']
          });
          newOwnerUserToListTable!.privileges = 'owner';
          await newOwnerUserToListTable!.save();
          /** Notify new list owner if they're online */
          await publish({
            updatedListId: listId,
            userIdToShare: newOwnerUserToListTable!.userId,
            notification: `You are now the owner of list: "${newOwnerUserToListTable?.list.title}"`
          });
        }
      }
    }

    return { user: user };
  }
}
