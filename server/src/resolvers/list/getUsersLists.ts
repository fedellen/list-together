import { UserToList } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { validateContext } from '../types/validators/validateContext';

@Resolver()
export class GetUsersListsResolver {
  @UseMiddleware(logger)
  @Query(() => UserToListResponse)
  async getUsersLists(@Ctx() context: MyContext): Promise<UserToListResponse> {
    // Gets only the specified user's lists
    const errors = validateContext(context);
    if (errors) return { errors };

    const userToList = await UserToList.find({
      where: { userId: context.req.session.userId },
      relations: ['list', 'list.items', 'itemHistory']
    });

    if (!userToList) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'Could not find any lists for that userId..'
          }
        ]
      };
    }

    return { userToList };
  }
}
