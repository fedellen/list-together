import { useState, useCallback } from 'react';
import { useStrikeItemMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

export default function useStrikeItem() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const [strikeItem] = useStrikeItemMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );
  const sendMutation = useCallback(async (item: string) => {
    if (mutationSubmiting) return;
    setMutationSubmiting(true);
    /**
     *  Strike Item Mutation
     */
    try {
      /** Use `strikeItem` mutation */
      const { data } = await strikeItem({
        variables: {
          data: {
            itemName: item,
            listId: currentListId
          }
        }
      });
      if (data?.strikeItem.errors) {
        errorNotifaction(data.strikeItem.errors, dispatch);
        mutationCooldown();
      } else {
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      console.error(`Error on strikeItem mutation: ${err}`);
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
