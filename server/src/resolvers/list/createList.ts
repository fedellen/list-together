import { User, UserToList, List } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { validateContext } from '../types/validators/validateContext';
import { validateStringLength } from '../types/validators/validateStringLength';
import { UserWithListResponse } from '../types/response/UserWithListResponse';

@Resolver()
export class CreateListResolver {
  // Create a list
  @UseMiddleware(logger)
  @Mutation(() => UserWithListResponse)
  async createList(
    @Arg('title') title: string,
    @Ctx() context: MyContext
  ): Promise<UserWithListResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    const stringLengthErrors = validateStringLength(title);
    if (stringLengthErrors) return { errors: stringLengthErrors };

    const user = await User.findOne(context.req.session.userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'context',
            message: 'Context contains invalid user id..'
          }
        ]
      };
    }

    // Check to see if user already owns 15 lists
    const userToListTableArray = await UserToList.find({
      where: { userId: user.id }
    });
    const userToListTablesAsOwner = userToListTableArray.filter(
      (listConnection) => listConnection.privileges.includes('owner')
    );

    if (userToListTablesAsOwner.length >= 15) {
      return {
        errors: [
          {
            field: 'lists',
            message: 'User cannot create more than 15 lists..'
          }
        ]
      };
    }

    // Make the list 👌
    const list = await List.create({
      title
    }).save();
    const userToList = await UserToList.create({
      listId: list.id,
      userId: user.id,
      privileges: 'owner',
      list: list
    }).save();
    /** Add to front of user's sorted list array */
    if (user.sortedListsArray) {
      user.sortedListsArray = [list.id, ...user.sortedListsArray];
    } else {
      user.sortedListsArray = [list.id];
    }
    await user.save();

    return { userToList: userToList, user: user };
  }
}
