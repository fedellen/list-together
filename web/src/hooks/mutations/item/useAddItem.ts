import { useState, useCallback } from 'react';
import { useAddItemMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useCurrentSortedItems from '../../fragments/useCurrentSortedItems';

export default function useAddItem() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId: listId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );
  const [addItem] = useAddItemMutation();
  const sendMutation = useCallback(async (item: string) => {
    if (mutationSubmiting) return;
    /**
     *  Add Item Mutation
     */
    const itemName = item;
    if (!itemName) return;

    // Front-end validation for `addItem`
    if (currentSortedItems.includes(itemName)) {
      sendNotification(dispatch, [
        `That list already includes "${itemName}"..`
      ]);
      return;
    } else if (itemName.length < 2) {
      sendNotification(dispatch, [
        'Item length must contain 2 or more characters..'
      ]);
      return;
    } else if (itemName.length > 55) {
      sendNotification(dispatch, [
        'Item length must contain 55 characters or less..'
      ]);
      return;
    } else {
      // Use the mutation
      setMutationSubmiting(true);
      try {
        const { data } = await addItem({
          variables: {
            data: {
              nameInput: [itemName],
              listId
            }
          }
        });
        if (data?.addItem.errors) {
          errorNotification(data.addItem.errors, dispatch);
          mutationCooldown();
        } else {
          dispatch({
            type: 'ADD_TO_UNDO',
            payload: ['addItem', { itemName, listId }]
          });

          dispatch({ type: 'CLEAR_STATE' });
        }
      } catch (err) {
        sendNotification(dispatch, [
          'Connection to the server could not be established. Interacting with the list will not function offline.'
        ]);
        dispatch({ type: 'CLEAR_STATE' });
      }
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
