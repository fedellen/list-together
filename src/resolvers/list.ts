import { List, UserToList } from '../entities';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';

@Resolver()
export class ListResolver {
  // Retrieves ALL lists in the database
  // Refactor later to retrieve only the current user's lists
  @Query(() => [List])
  getAllLists(): Promise<List[]> {
    const listRepository = getRepository(List);
    return listRepository.find({});
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
}
