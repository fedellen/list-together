import { useState, useCallback } from 'react';
import { useStrikeItemMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';

export default function useStrikeItem() {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const [strikeItem] = useStrikeItemMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmitting(false)
  );
  const sendMutation = useCallback(async (item: string) => {
    if (mutationSubmitting) return;
    setMutationSubmitting(true);
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
        errorNotification(data.strikeItem.errors, dispatch);
        mutationCooldown();
      } else {
        dispatch({
          type: 'ADD_TO_UNDO',
          payload: ['strikeItem', { itemName: item, listId: currentListId }]
        });
      }
      dispatch({ type: 'CLEAR_STATE' });
    } catch (err) {
      sendNotification(dispatch, [
        'Connection to the server could not be established. Interacting with the list will not function offline.'
      ]);
      dispatch({ type: 'CLEAR_STATE' });
    }
  }, []);

  return [sendMutation, mutationSubmitting] as const;
}
