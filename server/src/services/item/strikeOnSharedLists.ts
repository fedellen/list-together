import { SubscriptionPayload } from '../../resolvers/types/subscription/SubscriptionPayload';
import { UserToList } from '../../entities';
import { getSharedListTables } from '../list/getSharedListTables';

export const strikeOnSharedLists = async (
  userToList: UserToList,
  strikedItems: string[],
  unStrikedItems: string[],
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
          table.sortedItems = [
            ...unStrikedItems,
            ...(table.sortedItems?.filter(
              (i) => ![...strikedItems, ...unStrikedItems].includes(i)
            ) || []),
            ...strikedItems
          ];
          await table.save();
        }
      })
    );

    const allItems = [...strikedItems, ...unStrikedItems];
    await publish({
      updatedListId: userToList.listId,
      /** Don't notify user who striked the item */
      userIdToExclude: userToList.userId,
      notification:
        allItems.length === 1
          ? `'${allItems[0]}' has been ${
              userToList.list.items?.find((i) => i.name === allItems[0])!.strike
                ? 'striked'
                : 'un-striked'
            } on list '${userToList.list.title}'.`
          : `Items have been striked on list '${userToList.list.title}'.`
    });
  }
};
