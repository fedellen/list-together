import { List } from 'src/generated/graphql';
import useFragment from '../useFragment';

export default function useCurrentListName(): string {
  const listFragment = useFragment({
    fragmentField: ['List', 'title']
  }) as List | null;

  if (!listFragment) return '';
  return listFragment.title;
}
