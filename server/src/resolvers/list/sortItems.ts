import { UserToList } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { StringArrayInput } from '../types/input/StringArrayInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { validateContext } from '../types/validators/validateContext';

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
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };
    // Authorized user sends array of item names, and the listId
    const userId = context.req.session.userId;
    const userToList = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });
    if (!userToList) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    }

    const sortedItemsArray = sortedItemsInput.stringArray;
    userToList.sortedItems = sortedItemsArray;

    await userToList.save();
    return { userToList: [userToList] };
  }
}
