import { User } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useFragment from '../useFragment';

export default function useSortedLists(): string[] {
  const [{ currentUserId }] = useStateValue();
  const userFragment = useFragment({
    fragmentField: ['User', 'sortedListsArray'],
    id: currentUserId
  }) as User | null;

  if (!userFragment || !userFragment.sortedListsArray) return [];
  return userFragment.sortedListsArray;
}
