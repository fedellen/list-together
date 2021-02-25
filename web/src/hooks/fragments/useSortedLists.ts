import { User } from 'src/generated/graphql';
import useFragment from '../useFragment';

export default function useSortedLists(): string[] {
  const userFragment = useFragment({
    fragmentField: ['User', 'sortedListsArray']
  }) as User | null;

  if (!userFragment || !userFragment.sortedListsArray) return [];
  return userFragment.sortedListsArray;
}
