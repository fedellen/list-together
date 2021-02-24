import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { StringArrayInput } from '../types/input/StringArrayInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { getUserListTable } from '../../services/list/getUserListTable';

@Resolver()
export class SortItemsResolver {
  // Re-order list -- save the user's order of the items on a list
  // User will also submit their `autoSortedList` through this mutation
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async sortItems(
    @Arg('data') sortedItemsInput: StringArrayInput,
    @Arg('listId') listId: string,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    const sortedItemsArray = sortedItemsInput.stringArray;
    userToListTable.sortedItems = sortedItemsArray;

    await userToListTable.save();
    return { userToList: [userToListTable] };
  }
}
