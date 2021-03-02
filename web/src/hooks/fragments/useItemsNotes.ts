import { Item } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useFragment from '../useFragment';

export default function useItemsNotes(): string[] {
  const [{ listState }] = useStateValue();
  if (listState[0] !== 'item') return [];
  const itemId = listState[1].id;

  const itemFragment = useFragment({
    fragmentField: ['Item', 'notes'],
    id: itemId
  }) as Item | null;

  if (!itemFragment || !itemFragment.notes) return [];
  return itemFragment.notes;
}
