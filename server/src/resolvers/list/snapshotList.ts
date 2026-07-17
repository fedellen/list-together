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

    // TODO: Apply full snapshot item rules and history updates.
    // This first iteration wires the full payload shape end-to-end.
    userToListTable.sortedItems = snapshotedList.items.map((item) => item.name);

    // TODO: HANDLE ALL LIST LOGIC HERE -- SNAPSHOT EVERYTHING
    // FOR NOW JUST UPDATE SORTED ITEMS FOR MVP AND TESTING

    await userToListTable.save();
    return { userToList: [userToListTable] };
  }
}
