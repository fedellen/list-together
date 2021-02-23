import { UserToList } from '../../entities';

/** Get all UserToList tables that match listIds but do not match the current user's id */
export const getSharedListTables = async (
  userToList: UserToList
): Promise<UserToList[]> => {
  const allUserToListTables = await UserToList.find({
    where: { listId: userToList.listId }
  });
  // Return UserToList tables without the current user add to current user's table
  return allUserToListTables.filter(
    (list) => list.userId !== userToList.userId
  );
};
