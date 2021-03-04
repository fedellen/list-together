import { useState, useCallback } from 'react';
import { useAddItemMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import useCurrentSortedItems from '../../fragments/useCurrentSortedItems';

export default function useAddItem() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();
  const [addItem] = useAddItemMutation();
  const sendMutation = useCallback(
    async (item?: string, listId?: string, itemArray?: string[]) => {
      if (mutationSubmiting) return;
      /**
       *  Add Item Mutation
       */
      let arrayToSend: string[];
      if (itemArray) {
        arrayToSend = itemArray;
      } else {
        if (!item) return;
        // Front-end validation for `addItem`
        if (currentSortedItems.includes(item)) {
          sendNotification(dispatch, [
            `That list already includes "${item}"..`
          ]);
          return;
        } else if (item.length < 2) {
          sendNotification(dispatch, [
            'Item length must contain 2 or more characters..'
          ]);
          return;
        } else if (item.length > 30) {
          sendNotification(dispatch, [
            'Item length must contain 30 characters or less..'
          ]);
          return;
        }
        arrayToSend = [item];
      }

      // Use the mutation
      setMutationSubmiting(true);
      try {
        const { data } = await addItem({
          variables: {
            data: {
              nameInput: arrayToSend,
              listId: listId || currentListId
            }
          }
        });
        if (data?.addItem.errors) {
          errorNotifaction(data.addItem.errors, dispatch);
          delayedFunction(() => setMutationSubmiting(false));
        } else {
          dispatch({ type: 'CLEAR_STATE' });
        }
      } catch (err) {
        console.error('Error on Add Item mutation: ', err);
      }
    },
    []
  );

  return [sendMutation, mutationSubmiting] as const;
}
