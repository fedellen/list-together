import { useState, useCallback } from 'react';
import { useEditItemNameMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';

export default function useEditItemName() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const [editItemName] = useEditItemNameMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );
  const sendMutation = useCallback(
    async (item: string, newItemName: string) => {
      if (mutationSubmiting) return;
      setMutationSubmiting(true);
      /**
       *  Edit Item Name Mutation
       */

      try {
        /** Use `editItemName` mutation */
        const { data } = await editItemName({
          variables: {
            data: {
              itemName: item,
              listId: currentListId,
              newItemName: newItemName
            }
          }
        });
        if (data?.editItemName.errors) {
          errorNotification(data.editItemName.errors, dispatch);
          mutationCooldown();
        } else {
          dispatch({
            type: 'ADD_TO_UNDO',
            payload: [
              'editItemName',
              {
                oldItemName: item,
                listId: currentListId,
                newItemName: newItemName
              }
            ]
          });
        }
        dispatch({ type: 'CLEAR_STATE' });
      } catch (err) {
        console.error(
          'An error has occurred, if this problem persists please submit an Issue on Github:',
          err
        );
        sendNotification(dispatch, [
          'Connection to the server could not be established. Interacting with the list will not function offline.'
        ]);
        dispatch({ type: 'CLEAR_STATE' });
      }
    },
    []
  );

  return [sendMutation, mutationSubmiting] as const;
}
