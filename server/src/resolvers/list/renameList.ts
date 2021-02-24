import { UserToList } from '../../entities';
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
import { ListResponse } from '../types/response/ListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { validateContext } from '../types/validators/validateContext';

@Resolver()
export class RenameListResolver {
  // Rename List
  @UseMiddleware(logger)
  @Mutation(() => ListResponse)
  async renameList(
    @Arg('name') name: string,
    @Arg('listId') listId: string,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<ListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { userId: userId, listId: listId },
      relations: ['list']
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    } else if (!userToListTable.privileges.includes('owner')) {
      return {
        errors: [
          {
            field: 'userToList',
            message: 'User does not have rights to rename that list..'
          }
        ]
      };
    }

    userToListTable.list.title = name;
    await userToListTable.save();
    await publish({ updatedListId: listId });

    // Server saves and returns array
    return { list: userToListTable.list };
  }
}
