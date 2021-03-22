import { SubscriptionPayload } from '../../resolvers/types/subscription/SubscriptionPayload';
import { List, UserToList } from '../../entities';

export const resolveListOwnership = async (
  listId: string,
  publish: (payload: SubscriptionPayload) => Promise<void>
) => {
  // Handle new list ownership in database
  const listInDatabase = await List.findOne(listId, {
    relations: ['userConnection']
  });
  if (listInDatabase) {
    if (listInDatabase.userConnection.length === 0) {
      // Delete list from the database if no User Connections exist
      await listInDatabase.remove();
    } else {
      const remainingUsersArray = listInDatabase.userConnection;
      const isOwnerExist = remainingUsersArray.filter((userToList) =>
        userToList.privileges.includes('owner')
      );

      if (isOwnerExist.length === 0) {
        // If no owner of list exists, give owner privileges to first indexed user
        const newOwnerUserToListTable = await UserToList.findOne({
          where: { userId: remainingUsersArray[0].userId, listId: listId },
          relations: ['list']
        });
        newOwnerUserToListTable!.privileges = 'owner';
        await newOwnerUserToListTable!.save();
        /** Notify new list owner if they're online */
        await publish({
          updatedListId: listId,
          userIdToShare: newOwnerUserToListTable!.userId,
          notification: `You are now the owner of list: "${newOwnerUserToListTable?.list.title}"`
        });
      }
    }
  }
};
