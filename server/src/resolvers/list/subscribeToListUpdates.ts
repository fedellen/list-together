import { UserToList } from '../../entities';
import { MyContext } from '../../MyContext';
import {
  Args,
  Ctx,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription
} from 'type-graphql';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionArgs } from '../types/subscription/SubscriptionArgs';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';

@Resolver()
export class SubscribeToListUpdatesResolver {
  @Subscription(() => UserToListResponse, {
    topics: 'updateList',
    filter: ({
      payload,
      args
    }: ResolverFilterData<SubscriptionPayload, SubscriptionArgs>) => {
      return args.listIdArray.includes(payload.updatedListId);
    }
  })
  async subscribeToListUpdates(
    @Root()
    {
      updatedListId,
      userIdToShare,
      userIdToExclude,
      notification
    }: SubscriptionPayload,
    // Frontend sends array of their ListIds to subscribe to
    @Args() {}: SubscriptionArgs,
    @Ctx() { connection }: MyContext
  ): Promise<UserToListResponse | null> {
    const userId: string = userIdToShare
      ? userIdToShare /** Newly shared list for the user */
      : connection.context.req.session.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: 'context',
            message: 'Context contains no userId..'
          }
        ]
      };
    }

    /** Return user an undefined response instead of null to keep subscription alive */
    if (
      userIdToExclude === userId ||
      (userIdToShare && userIdToShare !== connection.context.req.session.userId)
    )
      return { userToList: undefined };

    const usersList = await UserToList.findOne({
      where: {
        userId: userId,
        listId: updatedListId
      },
      relations: ['list', 'list.items', 'itemHistory']
    });
    if (!usersList) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'Could not find that list connection..'
          }
        ]
      };
    }

    return {
      userToList: [usersList],
      notifications: notification ? [notification] : []
    };
  }
}
