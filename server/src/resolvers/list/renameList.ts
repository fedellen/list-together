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
import { getUserListTable } from '../../services/list/getUserListTable';

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
    const getListPayload = await getUserListTable({
      context,
      listId,
      relations: ['list'],
      validatePrivilege: 'delete'
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    userToListTable.list.title = name;
    await userToListTable.save();
    await publish({ updatedListId: listId });

    // Server saves and returns array
    return { list: userToListTable.list };
  }
}
