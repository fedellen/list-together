import { User } from '../../entities';
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
import { resolveListOwnership } from '../../services/list/resolveListOwnership';

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

    // Deletes list from database or assigns new list owner
    resolveListOwnership(listId, publish);

    return { user: user };
  }
}
