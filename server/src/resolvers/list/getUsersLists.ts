import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { getUserListTable } from '../../services/list/getUserListTable';

@Resolver()
export class GetUsersListsResolver {
  @UseMiddleware(logger)
  @Query(() => UserToListResponse)
  async getUsersLists(@Ctx() context: MyContext): Promise<UserToListResponse> {
    // Gets all of the logged in user's lists
    const getListPayload = await getUserListTable({
      context: context,
      relations: ['itemHistory', 'list', 'list.items']
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    else if (!getListPayload.userToList)
      throw new Error(
        'Unresolved error has occured during `getUsersList` query..'
      );

    return { userToList: getListPayload.userToList };
  }
}
