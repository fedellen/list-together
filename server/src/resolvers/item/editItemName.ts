import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { EditItemNameInput } from '../types/input/EditItemNameInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { getUserListTable } from '../../services/list/getUserListTable';
import { replaceInArray } from '../../utils/replaceInArray';
import { validateStringLength } from '../types/validators/validateStringLength';

@Resolver()
/** Edit name of item and history of item */
export class EditItemNameResolver {
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async editItemName(
    @Arg('data') { listId, itemName, newItemName }: EditItemNameInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    const stringLengthErrors = validateStringLength(newItemName);
    if (stringLengthErrors) return { errors: stringLengthErrors };

    const getListPayload = await getUserListTable({
      context,
      listId,
      relations: ['list', 'list.items', 'itemHistory'],
      validatePrivilege: 'add',
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

    // Edit item on sortedItems
    if (userToListTable.sortedItems) {
      const newSortedItems = replaceInArray({
        array: userToListTable.sortedItems,
        oldItem: item.name,
        newItem: newItemName
      });

      if (newSortedItems) {
        userToListTable.sortedItems = newSortedItems;
      }
    }

    // Change the item name
    item.name = newItemName;

    const itemInHistory = userToListTable.itemHistory?.find(
      (history) => history.item
    );
    if (itemInHistory) {
      // Change the item's history
      itemInHistory.item = newItemName;
    }

    await userToListTable.save();
    publish({
      updatedListId: listId,
      userIdToExclude: userToListTable.userId,
      notification: `Item name '${item.name}' changed to '${newItemName}' on list '${userToListTable.list.title}'`
    });
    return { userToList: [userToListTable] };
  }
}
