import { SharedUsers, UserToList } from 'src/generated/graphql';
import useFragment from '../useFragment';

export default function useCurrentSharedUsers(): SharedUsers[] {
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'sharedUsers']
  }) as UserToList | null;

  if (!userToListFragment || !userToListFragment.sharedUsers) return [];
  return userToListFragment.sharedUsers;
}
