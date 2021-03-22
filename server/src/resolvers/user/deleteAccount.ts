import { User, UserToList } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import {
  Ctx,
  Resolver,
  UseMiddleware,
  PubSub,
  Publisher,
  Mutation
} from 'type-graphql';
import { resolveListOwnership } from '../../services/list/resolveListOwnership';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';

@Resolver()
/** Deletes account from database */
export class DeleteAccountResolver {
  @UseMiddleware(logger)
  @Mutation(() => Boolean, { nullable: true })
  async deleteAccount(
    @Ctx() { req }: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<boolean | null> {
    const userId = req.session.userId;
    // User not logged in
    if (!userId) return null;

    const user = await User.findOne(userId);
    // User was not found..
    if (!user) return null;

    const usersListTables = await UserToList.find({
      where: { userId: userId }
    });

    // Delete all userListTables and delete List tables / resolve their ownership
    for (const userList of usersListTables) {
      await userList.remove();
      await resolveListOwnership(userList.listId, publish);
    }

    // Delete the user 👍
    await user.remove();

    return true;
  }
}
