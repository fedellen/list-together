import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { itemRemovalCallback } from '../../services/item/itemRemovalCallback';
import { sortIntoList } from '../../services/item/sortIntoList';
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { StrikeItemInput } from '../types/input/StrikeItemInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { getUserListTable } from '../../services/list/getUserListTable';
import { strikeOnSharedLists } from '../../services/item/strikeOnSharedLists';

@Resolver()
export class StrikeItemResolver {
  // Style items on list
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async strikeItem(
    @Arg('data') { listId, itemName }: StrikeItemInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    const getListPayload = await getUserListTable({
      context,
      listId,
      relations: ['list', 'list.items', 'itemHistory'],
      validatePrivilege: 'strike',
      validateItemsExist: true
    });
    if (getListPayload.errors) return { errors: getListPayload.errors };
    const userToListTable = getListPayload.userToList![0];

    const item = userToListTable.list.items!.find(
      ({ name }) => name === itemName
    );
    if (!item) {
      return {
        errors: [
          {
            field: 'name',
            message: 'Item does not exist on list..'
          }
        ]
      };
    }

    // Strike the item
    item.strike = !item.strike;

    if (item.strike) {
      // Sort striked items to the end of the list
      if (userToListTable.sortedItems) {
        const newSortedItems = userToListTable.sortedItems.filter(
          (i) => i !== item.name
        );
        userToListTable.sortedItems = [...newSortedItems, item.name];
      }
      // Add to removalArray for callback
      if (userToListTable.removedItems) {
        userToListTable.removedItems = [
          ...userToListTable.removedItems,
          item.name
        ];
      } else {
        userToListTable.removedItems = [item.name];
      }
      itemRemovalCallback(userToListTable, item.name);
    } else {
      // Sort un-striked items back into the list
      if (userToListTable.sortedItems) {
        const sortedListWithoutUnStrikedItem =
          userToListTable.sortedItems.filter((i) => i !== item.name);
        userToListTable.sortedItems = sortedListWithoutUnStrikedItem;

        userToListTable.sortedItems = sortIntoList(userToListTable, item.name);
      }
      // Item was un-striked -- remove it from removalArray if found
      if (userToListTable.removedItems?.includes(item.name)) {
        userToListTable.removedItems = userToListTable.removedItems.filter(
          (i) => i !== item.name
        );
      }
    }

    await userToListTable.save();
    if (item.strike) {
      strikeOnSharedLists(userToListTable, [item.name], [], publish);
    } else {
      strikeOnSharedLists(userToListTable, [], [item.name], publish);
    }
    return { userToList: [userToListTable] };
  }
}
