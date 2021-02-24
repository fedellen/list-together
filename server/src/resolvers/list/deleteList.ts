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
import { BooleanResponse } from '../types/response/BooleanResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { validateContext } from '../types/validators/validateContext';

@Resolver()
export class DeleteListResolver {
  @UseMiddleware(logger)
  @Mutation(() => BooleanResponse)
  async deleteList(
    @Arg('listId') listId: string,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<BooleanResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const user = await User.findOne(context.req.session.userId);

    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: context.req.session.userId }
    });

    if (!user) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'A user with that ID could not be found..'
          }
        ]
      };
    } else if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    }

    if (user.sortedListsArray) {
      user.sortedListsArray = user.sortedListsArray.filter(
        (listId) => listId !== userToListTable.listId
      );
      await user.save();
    }
    await userToListTable.remove();

    const listInDatabase = await List.findOne(listId, {
      relations: ['userConnection']
    });

    if (listInDatabase) {
      if (listInDatabase.userConnection.length === 0) {
        // Remove list from the database if no User Connections exist
        await listInDatabase.remove();
      } else {
        const remainingUsersArray = listInDatabase.userConnection;
        const isOwnerExist = remainingUsersArray.filter((userToList) =>
          userToList.privileges.includes('owner')
        );

        if (isOwnerExist.length === 0) {
          // If no owner of list exists, give owner privileges to next user
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

    return { boolean: true };
  }
}
