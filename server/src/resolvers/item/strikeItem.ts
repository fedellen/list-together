import { UserToList } from '../../entities';
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
import { validateContext } from '../types/validators/validateContext';
import { validateUserToList } from '../types/validators/validateUserToList';

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
    const errors = validateContext(context);
    if (errors) return { errors };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'strike',
      validateItemsExist: true
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable || !userToListTable.list.items)
      throw new Error('UserList validation error on `strikeItems`..');

    const item = userToListTable.list.items.find(
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
      // Sort unstriked items back into the list
      if (userToListTable.sortedItems) {
        const sortedListWithoutUnstrikedItem = userToListTable.sortedItems.filter(
          (i) => i !== item.name
        );
        userToListTable.sortedItems = sortedListWithoutUnstrikedItem;
        const newSortedItems = sortIntoList(userToListTable, item.name)
          .sortedItems;
        userToListTable.sortedItems = newSortedItems;
      }
      // Item was unstriked -- remove it from removalArray if found
      if (userToListTable.removedItems?.includes(item.name)) {
        userToListTable.removedItems = userToListTable.removedItems.filter(
          (i) => i !== item.name
        );
      }
    }

    await userToListTable.save();
    await publish({ updatedListId: listId, userIdToExclude: userId });
    return { userToList: [userToListTable] };
  }
}
