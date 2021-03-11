import { useState, useCallback } from 'react';
import { useDeleteItemsMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';

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
        errorNotification(data.deleteItems.errors, dispatch);
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
        mutationCooldown();
        dispatch({ type: 'SET_SIDE_MENU_STATE', payload: 'add' });
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      sendNotification(dispatch, [
        'Connection to the server could not be established. Interacting with the list will not function offline.'
      ]);
      dispatch({ type: 'CLEAR_STATE' });
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
