import { List, User, UserToList } from '../entities';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';
import { ShareListInput } from './input-types/ShareListInput';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class ListResolver {
  // Gets only the specified user's lists
  @UseMiddleware(isAuth, logger)
  @Query(() => [UserToList])
  async getUsersLists(@Ctx() { req }: MyContext): Promise<UserToList[]> {
    const usersListArray = UserToList.find({
      where: { userId: req.session.userId },
      relations: ['list', 'list.items', 'itemHistory']
    });
    if (!usersListArray) throw new Error('No lists were found for that User..');

    return usersListArray;
  }

  // Create a list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => List)
  async createList(
    @Arg('title') title: string,
    @Ctx() { req }: MyContext
  ): Promise<List> {
    const list = await List.create({
      title
    }).save();
    await UserToList.create({
      listId: list.id,
      userId: req.session.userId
    }).save();
    return list;
  }

  // Share a list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  async shareList(
    @Arg('data') { email, listId, privileges }: ShareListInput,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const userId = req.session.userId;
    const userOwnerOfList = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });

    if (!userOwnerOfList)
      throw new Error('You do not have access to that list..');
    if (userOwnerOfList.privileges !== ['owner'])
      throw new Error('You do not have owner privileges to that list..');

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error(
        'A user with that email address does not exist in the database..'
      );
    }
    const userToListTable = await UserToList.create({
      listId,
      privileges,
      userId: user.id
    }).save();
    console.log(userToListTable);
    return true;
  }
}
