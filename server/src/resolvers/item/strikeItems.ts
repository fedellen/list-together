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
import { StrikeItemsInput } from '../types/input/StrikeItemsInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { getUserListTable } from '../../services/list/getUserListTable';
import { strikeOnSharedLists } from '../../services/item/strikeOnSharedLists';
import { FieldError } from '../types/response/FieldError';

@Resolver()
export class StrikeItemsResolver {
  // Style items on list
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async strikeItems(
    @Arg('data') { listId, itemNameArray }: StrikeItemsInput,
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

    const errors: FieldError[] = [];
    const strikedItems: string[] = [];
    const unStrikedItems: string[] = [];

    for (const itemName of itemNameArray) {
      const item = userToListTable.list.items!.find(
        ({ name }) => name === itemName
      );
      if (!item) {
        errors.push({
          field: 'name',
          message: `Item 
              "${item}" does not exist on list...`
        });
        continue;
      }

      // Strike the item
      item.strike = !item.strike;
      if (item.strike) {
        strikedItems.push(itemName);
      } else {
        unStrikedItems.push(itemName);
      }
    }
    userToListTable.sortedItems = [
      ...unStrikedItems,
      ...(userToListTable.sortedItems?.filter(
        (i) => ![...strikedItems, ...unStrikedItems].includes(i)
      ) || []),
      ...strikedItems
    ];

    await userToListTable.save();
    strikeOnSharedLists(userToListTable, strikedItems, unStrikedItems, publish);
    return { userToList: [userToListTable] };
  }
}
