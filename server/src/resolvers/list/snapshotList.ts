import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { SnapshotListInput } from '../types/input/SnapshotListInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { getUserListTable } from '../../services/list/getUserListTable';

@Resolver()
export class SnapshotListResolver {
  // Save a snapshot of the list -- save the user's order of the items on a list
  // With this resolver we are deprecating per item mutations/interactions
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async snapshotList(
    @Arg('data') snapshotedList: SnapshotListInput,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId: snapshotedList.listId,
      relations: ['itemHistory', 'list', 'list.items']
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    // Save the sorted items array for the list -- this is the MVP for now, we will handle all other logic later
    userToListTable.sortedItems = snapshotedList.items.map((item) => item.name);

    // TODO: HANDLE ALL LIST LOGIC HERE -- SNAPSHOT EVERYTHING
    // FOR NOW JUST UPDATE SORTED ITEMS FOR MVP AND TESTING

    // Full snapshot save -- but doesnt handle individual updates to item history
    // userToListTable.list.items = snapshotedList.items.map((item) =>
    //   Item.create({
    //     name: item.name,
    //     notes: item.notes ?? null,
    //     strike: item.strike
    //   })
    // );

    await userToListTable.save();
    return { userToList: [userToListTable] };
  }
}
