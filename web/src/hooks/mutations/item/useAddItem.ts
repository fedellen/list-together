import { useState, useCallback } from 'react';
import { useAddItemMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useCurrentSortedItems from '../../fragments/useCurrentSortedItems';

export default function useAddItem() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [
    { currentListId: listId, undoState, redoState },
    dispatch
  ] = useStateValue();
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

    /** Index of item on undoState? */
    let itemOnUndo: number | null = null;
    /** Index of item on redoState? */
    let itemOnRedo: number | null = null;
    for (const undo of undoState) {
      if (
        undo[0] === 'deleteItems' &&
        undo[1].itemNameArray.includes(itemName)
      ) {
        itemOnUndo = undoState.indexOf(undo);
      }
    }
    for (const redo of redoState) {
      if (redo[0] === 'addItem' && itemName === redo[1].itemName) {
        itemOnRedo = redoState.indexOf(redo);
      }
    }
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
              nameInput: [itemName],
              listId
            }
          }
        });
        if (data?.addItem.errors) {
          errorNotification(data.addItem.errors, dispatch);
          mutationCooldown();
        } else {
          if (itemOnUndo) {
            dispatch({ type: 'REMOVE_UNDO', payload: itemOnUndo });
          } else if (itemOnRedo) {
            dispatch({ type: 'REMOVE_REDO', payload: itemOnRedo });
          } else {
            dispatch({
              type: 'ADD_TO_UNDO',
              payload: ['addItem', { itemName, listId }]
            });
          }
          dispatch({ type: 'CLEAR_STATE' });
        }
      } catch (err) {
        console.error('Error on Add Item mutation: ', err);
      }
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
