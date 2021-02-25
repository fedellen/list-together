import { UserToList } from 'src/generated/graphql';
import useFragment from '../useFragment';

export default function useCurrentMostCommonWords(): string[] {
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'mostCommonWords']
  }) as UserToList | null;

  if (!userToListFragment || !userToListFragment.mostCommonWords) return [];
  return userToListFragment.mostCommonWords;
}
