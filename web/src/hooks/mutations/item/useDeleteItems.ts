import { useState, useCallback } from 'react';
import { useDeleteItemsMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { errorNotifaction } from 'src/utils/errorNotification';

export default function useDeleteItems() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const [deleteItems] = useDeleteItemsMutation();
  const sendMutation = useCallback(async (itemNames: string[]) => {
    if (mutationSubmiting) return;
    /**
     *  Delete Items Mutation
     */
    setMutationSubmiting(true);
    try {
      const { data } = await deleteItems({
        variables: {
          data: {
            itemNameArray: itemNames,
            listId: currentListId
          }
        }
      });
      if (data?.deleteItems.errors) {
        errorNotifaction(data.deleteItems.errors, dispatch);
        delayedFunction(() => setMutationSubmiting(false));
      } else {
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      console.error(`Error on Delete Item mutation: ${err}`);
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
