import { Item } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useFragment from '../useFragment';

export default function useItemsNotes(): string[] {
  const [{ activeItem }] = useStateValue();

  const itemFragment = useFragment({
    fragmentField: ['Item', 'notes'],
    id: activeItem[1]
  }) as Item | null;

  if (!itemFragment || !itemFragment.notes) return [];
  return itemFragment.notes;
}
