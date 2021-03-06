import { UserToList } from 'src/generated/graphql';
import useFragment from '../useFragment';
import { useStateValue } from 'src/state/state';

export default function useCurrentMostCommonWords(): string[] {
  const [{ currentListId }] = useStateValue();
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'mostCommonWords'],
    id: currentListId
  }) as UserToList | null;

  if (!userToListFragment || !userToListFragment.mostCommonWords) return [];
  return userToListFragment.mostCommonWords;
}
