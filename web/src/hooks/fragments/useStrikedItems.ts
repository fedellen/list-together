import { useMemo } from 'react';
import { List } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useFragment from '../useFragment';

export default function useStrikedItems(): string[] {
  const [{ listState }] = useStateValue();
  if (listState[0] !== 'item') return [];
  const itemId = listState[1].id;

  const listFragment = useFragment({
    fragmentField: ['List', 'items'],
    id: itemId
  }) as List | null;

  const strikedItems = useMemo(
    () =>
      listFragment?.items?.filter((i) => (i.strike = true)).map((i) => i.name),
    [listFragment]
  );

  if (!strikedItems) return [];
  return strikedItems;
}
