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
import { validateContext } from '../types/validators/validateContext';

@Resolver()
export class SubscribeToListUpdatesResolver {
  @Subscription(() => UserToListResponse, {
    topics: 'updateList',
    filter: ({
      payload,
      args,
      context
    }: ResolverFilterData<
      SubscriptionPayload,
      SubscriptionArgs,
      MyContext
    >) => {
      const userId: string = context.connection.context.req.session.userId;
      const { userIdToShare, userIdToExclude, updatedListId } = payload;
      if (userIdToShare) {
        // userIdToShare exists when list is newly shared
        // Filter returns true only if the shared user is the subscribed user
        return userIdToShare === userId;
      } else if (userIdToExclude && userIdToExclude === userId) {
        // To avoid self-notifications, the userID who pushed the updated is excluded
        return false;
      } else {
        // Return true if user is subscribed to that list
        return args.listIdArray.includes(updatedListId);
      }
    }
  })
  async subscribeToListUpdates(
    @Root()
    { updatedListId, notification }: SubscriptionPayload,
    // Frontend sends array of their ListIds to subscribe to
    @Args() {}: SubscriptionArgs,
    @Ctx() { connection }: MyContext
  ): Promise<UserToListResponse | null> {
    const userId: string = connection.context.req.session.userId;
    const errors = validateContext(connection.context);
    if (errors) return { errors };

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
