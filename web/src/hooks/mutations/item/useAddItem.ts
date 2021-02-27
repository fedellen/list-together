import { useState, useCallback } from 'react';
import { useAddItemMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { sendNotification, closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import useCurrentSortedItems from '../../fragments/useCurrentSortedItems';

export default function useAddItem() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();
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
    } else if (itemName.length > 30) {
      sendNotification(dispatch, [
        'Item length must contain 30 characters or less..'
      ]);
      return;
    } else {
      // Use the mutation
      setMutationSubmiting(true);
      try {
        const { data } = await addItem({
          variables: {
            data: {
              nameInput: itemName,
              listId: currentListId
            }
          }
        });
        if (data?.addItem.errors) {
          errorNotifaction(data.addItem.errors, dispatch);
          delayedFunction(() => setMutationSubmiting(false));
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error on Add Item mutation: ', err);
      }
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
