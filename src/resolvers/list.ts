import { List, UserPrivileges, UserToList } from '../entities';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

@Resolver(UserToList)
export class ListResolver {
  // Gets only the specified user's lists
  @Authorized()
  @Query(() => [UserToList])
  async getUsersLists(@Arg('userId') userId: string): Promise<UserToList[]> {
    const usersListArray = UserToList.find({
      where: { userId: userId },
      relations: ['list', 'list.items', 'itemHistory']
    });
    if (!usersListArray) throw new Error('No lists were found for that User..');

    return usersListArray;
  }

  @Mutation(() => List)
  async createList(
    @Arg('title') title: string,
    @Arg('userId') userId: string
  ): Promise<List> {
    const list = await List.create({
      title
    }).save();
    await UserToList.create({
      listId: list.id,
      userId
    }).save();
    return list;
  }

  // // Share a list  // @Mutation(() => List)
  // shareList(
  //   @Arg('listId') listId: string,
  //   @Arg('privleges') privleges: UserPrivileges[],
  // ): void {
  //   const
  // }
  // @Mutation(() => List)
  // shareList(
  //   @Arg('listId') listId: string,
  //   @Arg('privleges') privleges: UserPrivileges[],
  // ): void {
  //   const
  // }
}
