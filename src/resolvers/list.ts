import { List, UserPrivileges, UserToList } from '../entities';
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { getRepository } from 'typeorm';

@Resolver(UserToList)
export class ListResolver {
  // // Retrieves ALL lists in the database
  // @Query(() => [List])
  // getAllLists(): Promise<List[]> {
  //   const listRepository = getRepository(List);
  //   return listRepository.find({});
  // }

  @FieldResolver(() => UserToList)
  mostCommonWords(@Root() parent: UserToList) {
    if (!parent.itemHistory) return null;
    const sortedHistory = parent.itemHistory.sort(
      (a, b) => b.timesAdded - a.timesAdded
    );
    return sortedHistory.map((history) => history.item);
  }

  @FieldResolver(() => UserToList)
  autoSortedList(@Root() parent: UserToList) {
    // Sorted list by `removalOrder`
    // Rating based on shopping trip removal order
    // Should Only store the information when items
    return null;
  }

  // Gets only the specified user's lists
  @Query(() => [UserToList])
  async getUsersLists(@Arg('userId') userId: string): Promise<UserToList[]> {
    const usersListArray = await getRepository(UserToList).find({
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
