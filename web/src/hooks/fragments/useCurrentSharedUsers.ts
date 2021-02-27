import { SharedUsers, UserToList } from 'src/generated/graphql';
import useFragment from '../useFragment';
import { useStateValue } from 'src/state/state';

export default function useCurrentSharedUsers(): SharedUsers[] {
  const [{ currentListId }] = useStateValue();
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'sharedUsers'],
    id: currentListId
  }) as UserToList | null;

  if (!userToListFragment || !userToListFragment.sharedUsers) return [];
  return userToListFragment.sharedUsers;
}
