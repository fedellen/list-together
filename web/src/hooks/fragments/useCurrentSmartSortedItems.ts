import { UserToList } from 'src/generated/graphql';
import useFragment from '../useFragment';
import { useStateValue } from 'src/state/state';

export default function useCurrentSmartSortedItems(): string[] {
  const [{ currentListId }] = useStateValue();
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'smartSortedItems'],
    id: currentListId
  }) as UserToList | null;

  if (!userToListFragment || !userToListFragment.smartSortedItems) return [];
  return userToListFragment.smartSortedItems;
}
