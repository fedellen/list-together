import { SubscriptionPayload } from '../../resolvers/types/subscription/SubscriptionPayload';
import { UserToList } from '../../entities';
import { getSharedListTables } from '../list/getSharedListTables';
import { sortIntoList } from './sortIntoList';

export const strikeOnSharedLists = async (
  userToList: UserToList,
  itemName: string,
  strike: boolean,
  publish: (payload: SubscriptionPayload) => Promise<void>
) => {
  const sharedUserToListTables = await getSharedListTables(userToList);

  if (sharedUserToListTables.length > 0) {
    /** List has shared users, sort striked item */
    await Promise.all(
      sharedUserToListTables.map(async (table) => {
        if (!table.sortedItems) {
          console.error('Shared list has no sortedItems..');
        } else {
          if (strike) {
            table.sortedItems = [
              ...table.sortedItems.filter((i) => i !== itemName),
              itemName
            ];
          } else {
            table.sortedItems = table.sortedItems.filter((i) => i !== itemName);
            table.sortedItems = sortIntoList(table, itemName);
          }
          await table.save();
        }
      })
    );

    await publish({
      updatedListId: userToList.listId,
      /** Don't notify user who striked the item */
      userIdToExclude: userToList.userId,
      notification: `'${itemName}' has been ${
        strike ? 'striked' : 'un-striked'
      } on list '${userToList.list.title}'.`
    });
  }
};
