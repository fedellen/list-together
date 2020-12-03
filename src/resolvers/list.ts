import { List } from '../entities';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';

@Resolver()
export class ListResolver {
  // Retrieves ALL lists, refactor later to retrieve only user's list
  @Query(() => [List])
  lists(): Promise<List[]> {
    const listRepository = getRepository(List);
    return listRepository.find({});
  }
}
