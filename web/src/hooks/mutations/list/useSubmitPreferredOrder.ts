import { useState, useCallback } from 'react';
import { useSubmitPreferredOrderMutation } from 'src/generated/graphql';
import useCurrentSortedItems from 'src/hooks/fragments/useCurrentSortedItems';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';

export default function useSubmitPreferredOrder() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();

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
        errorNotifaction(data.submitPreferredOrder.errors, dispatch);
        delayedFunction(() => setMutationSubmiting(false));
      } else {
        sendNotification(dispatch, [
          'Your preferred order of all items currently on the list has been saved.'
        ]);
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      console.error('Error on Submit Preferred Order mutation: ', err);
    }
  }, [currentSortedItems]);

  return [sendMutation, mutationSubmiting] as const;
}
