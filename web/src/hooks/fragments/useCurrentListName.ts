import { List } from 'src/generated/graphql';
import useFragment from '../useFragment';
import { useStateValue } from 'src/state/state';

export default function useCurrentListName(): string {
  const [{ currentListId }] = useStateValue();
  const listFragment = useFragment({
    fragmentField: ['List', 'title'],
    id: currentListId
  }) as List | null;

  if (!listFragment) return '';
  return listFragment.title;
}
