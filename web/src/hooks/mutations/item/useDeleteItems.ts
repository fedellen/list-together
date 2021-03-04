import { useState, useCallback } from 'react';
import { useDeleteItemsMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

export default function useDeleteItems() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const [deleteItems] = useDeleteItemsMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );

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
        mutationCooldown();
      } else {
        dispatch({
          type: 'ADD_TO_UNDO',
          payload: [
            'deleteItems',
            {
              itemNameArray: itemNames,
              listId: currentListId
            }
          ]
        });
        dispatch({ type: 'SET_SIDE_MENU_STATE', payload: 'add' });
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      console.error(`Error on Delete Item mutation: ${err}`);
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
