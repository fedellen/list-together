import { UserToList } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { removeFromSharedLists } from '../../services/item/removeFromSharedLists';
import {
  UseMiddleware,
  Mutation,
  Arg,
  Publisher,
  Ctx,
  PubSub,
  Resolver
} from 'type-graphql';
import { DeleteItemsInput } from '../types/input/DeleteItemsInput';
import { FieldError } from '../types/response/FieldError';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { SubscriptionPayload } from '../types/subscription/SubscriptionPayload';
import { Topic } from '../types/subscription/SubscriptionTopics';
import { validateContext } from '../types/validators/validateContext';
import { validateUserToList } from '../types/validators/validateUserToList';
import { itemRemovalCallback } from '../../services/item/itemRemovalCallback';

@Resolver()
export class DeleteItemsResolver {
  // Delete array of items from list
  // Items will usually be deleted in batches from front-end `deleteStrikes`
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async deleteItems(
    @Arg('data') { itemNameArray, listId }: DeleteItemsInput,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>,
    @Ctx() context: MyContext
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
      validatePrivilege: 'delete',
      validateItemsExist: true
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable || !userToListTable.list.items)
      throw new Error('UserList validation error on `deleteItems`..');

    // Store each error, continue deleting items in the case of conflicts
    let deleteErrors: FieldError[] = [];
    itemNameArray.forEach(async (itemName) => {
      const itemExists = userToListTable.list.items!.find(
        ({ name }) => name === itemName
      );
      if (!itemExists) {
        const error = {
          field: 'itemName',
          message: `Item "${itemName}" was not found on the list..`
        };
        deleteErrors = [...deleteErrors, error];

        return;
      }

      if (userToListTable.sortedItems) {
        // Remove the deleted items from user's sorted list
        userToListTable.sortedItems = userToListTable.sortedItems.filter(
          (item) => item !== itemExists.name
        );
      }
      userToListTable.list.items! = userToListTable.list.items!.filter(
        (item) => item.name !== itemExists.name
      );
      itemRemovalCallback(userToListTable, itemName);
    });

    removeFromSharedLists(userToListTable, itemNameArray, publish);

    await userToListTable.save();
    return {
      userToList: [userToListTable],
      errors: deleteErrors.length > 0 ? deleteErrors : undefined
    };
  }
}
