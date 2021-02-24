import { User } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { StringArrayInput } from '../types/input/StringArrayInput';
import { UserResponse } from '../types/response/UserResponse';
import { validateContext } from '../types/validators/validateContext';

@Resolver()
export class SortListsResolver {
  // Authenticated users can save the following arrays regardless of their accuracy
  // Accuracy/synchronization conflicts will be handled on the front-end
  // Sorted list/item arrays are never used in the back-end for any purpose
  // Only storage of user's preferences

  // Sorted Lists -- the order that the lists are displayed
  @UseMiddleware(logger)
  @Mutation(() => UserResponse)
  async sortLists(
    @Arg('data') sortedlistsInput: StringArrayInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    // Authorized user sends array of listIds
    const userId = context.req.session.userId;
    const user = await User.findOne(userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'User does not exist..'
          }
        ]
      };
    }

    const sortedListsArray = sortedlistsInput.stringArray;
    user.sortedListsArray = sortedListsArray;

    await user.save();
    return { user };
  }
}
