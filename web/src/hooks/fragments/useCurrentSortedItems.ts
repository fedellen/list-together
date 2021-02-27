import { UserToList } from 'src/generated/graphql';
import useFragment from '../useFragment';
import { useStateValue } from 'src/state/state';

export default function useCurrentSortedItems(): string[] {
  const [{ currentListId }] = useStateValue();
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'sortedItems'],
    id: currentListId
  }) as UserToList | null;

  if (!userToListFragment || !userToListFragment.sortedItems) return [];
  return userToListFragment.sortedItems;
}
