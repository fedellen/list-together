import { useState, useCallback } from 'react';
import { useDeleteItemsMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

export default function useDeleteItems() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId, undoState, redoState }, dispatch] = useStateValue();
  const [deleteItems] = useDeleteItemsMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );

  const sendMutation = useCallback(async (itemNames: string[]) => {
    if (mutationSubmiting) return;
    /**
     *  Delete Items Mutation
     */
    /** Index of item on undoState? */
    let itemOnUndo: number | null = null;
    /** Index of item on redoState? */
    let itemOnRedo: number | null = null;
    for (const undo of undoState) {
      if (
        undo[0] === 'addItem' &&
        undo[1].listId === currentListId &&
        undo[1].itemName === itemNames[0]
      ) {
        itemOnUndo = undoState.indexOf(undo);
      }
    }
    for (const redo of redoState) {
      if (
        redo[0] === 'deleteItems' &&
        redo[1].listId === currentListId &&
        itemNames[0] === redo[1].itemNameArray[0]
      ) {
        itemOnRedo = redoState.indexOf(redo);
      }
    }
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
        if (itemOnUndo) {
          dispatch({ type: 'REMOVE_UNDO', payload: itemOnUndo });
        } else if (itemOnRedo) {
          dispatch({ type: 'REMOVE_REDO', payload: itemOnRedo });
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
        }
        dispatch({ type: 'SET_SIDE_MENU_STATE', payload: 'add' });
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      console.error(`Error on Delete Item mutation: ${err}`);
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
