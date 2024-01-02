import { useState, useCallback } from 'react';
import { useStrikeItemsMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';

export default function useStrikeItems() {
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const [{ currentListId: listId }, dispatch] = useStateValue();
  const [strikeItems] = useStrikeItemsMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmitting(false)
  );
  const sendMutation = useCallback(async (itemNameArray: string[]) => {
    if (mutationSubmitting) return;
    setMutationSubmitting(true);

    try {
      const { data } = await strikeItems({
        variables: {
          data: {
            itemNameArray,
            listId
          }
        }
      });
      if (data?.strikeItems.errors) {
        errorNotification(data.strikeItems.errors, dispatch);
        mutationCooldown();
      } else {
        dispatch({
          type: 'ADD_TO_UNDO',
          payload: ['strikeItems', { itemNameArray, listId }]
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
