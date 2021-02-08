import { SubscriptionPayload } from '../resolvers/types/subscription/SubscriptionPayload';
import { UserToList } from '../entities';
import { sortIntoList } from './sortIntoList';

export const addToSharedLists = async (
  userToList: UserToList,
  itemName: string,
  publish: (payload: SubscriptionPayload) => Promise<void>
) => {
  const allUserToListTables = await UserToList.find({
    where: { listId: userToList.listId },
    relations: ['itemHistory']
  });

  const sharedUserToListTables = allUserToListTables.filter(
    (list) => list.userId !== userToList.userId
  );

  if (sharedUserToListTables.length > 0) {
    /** List has shared users, add to their lists */
    await Promise.all(
      sharedUserToListTables.map(async (table) => {
        await sortIntoList(table, itemName).save();
      })
    );
    await publish({
      updatedListId: userToList.listId,
      /** Don't notify user who added item */
      userIdToExclude: userToList.userId,
      notification: `${itemName} was added to ${userToList.list.title}`
    });
  }
};
