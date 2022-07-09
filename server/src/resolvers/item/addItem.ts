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
import { AddItemInput } from '../types/input/AddItemInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { parseErrorIntoFieldError } from '../../services/fieldError';
import { AddItemHandler } from '../../services/AddItemHandler';

@Resolver()
export class AddItemResolver {
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async addItem(
    @Arg('data') { nameInput, listId }: AddItemInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    try {
      const addItemHandler = await AddItemHandler.initialize({
        context,
        listId,
        nameInput
      });
      const userToList = [await addItemHandler.addItems(publish)];

      return { userToList };
    } catch (err) {
      return { errors: [parseErrorIntoFieldError(err)] };
    }
  }
}
