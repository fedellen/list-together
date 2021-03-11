import { useState, useCallback } from 'react';
import { useSubmitPreferredOrderMutation } from 'src/generated/graphql';
import useCurrentSortedItems from 'src/hooks/fragments/useCurrentSortedItems';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
export default function useSubmitPreferredOrder() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmiting(false);
  });

  const [submitPreferredOrder] = useSubmitPreferredOrderMutation();
  const sendMutation = useCallback(async () => {
    if (mutationSubmiting) return;
    setMutationSubmiting(true);
    /**
     *  Submit Preferred Order Mutation
     */

    try {
      const { data } = await submitPreferredOrder({
        variables: {
          data: {
            listId: currentListId,
            removedItemArray: currentSortedItems
          }
        }
      });
      if (data?.submitPreferredOrder.errors) {
        errorNotification(data.submitPreferredOrder.errors, dispatch);
        mutationCooldown();
      } else {
        sendNotification(dispatch, [
          'Your preferred order of all items currently on the list has been saved.'
        ]);
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      sendNotification(dispatch, [
        'Connection to the server could not be established. Interacting with the list will not function offline.'
      ]);
      dispatch({ type: 'CLEAR_STATE' });
    }
  }, [currentSortedItems]);

  return [sendMutation, mutationSubmiting] as const;
}
