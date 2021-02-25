import { UserToList } from 'src/generated/graphql';
import useFragment from '../useFragment';

export default function useCurrentSortedItems(): string[] {
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'sortedItems']
  }) as UserToList | null;

  if (!userToListFragment || !userToListFragment.sortedItems) return [];
  return userToListFragment.sortedItems;
}
