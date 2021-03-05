import { useState, useCallback } from 'react';
import { useStrikeItemMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

export default function useStrikeItem() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId, undoState, redoState }, dispatch] = useStateValue();
  const [strikeItem] = useStrikeItemMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );
  const sendMutation = useCallback(async (item: string) => {
    if (mutationSubmiting) return;
    setMutationSubmiting(true);
    /**
     *  Strike Item Mutation
     */

    /** Index of item on undoState? */
    let itemOnUndo: number | null = null;
    /** Index of item on redoState? */
    let itemOnRedo: number | null = null;
    for (const undo of undoState) {
      if (
        undo[0] === 'strikeItem' &&
        undo[1].listId === currentListId &&
        item === undo[1].itemName
      ) {
        itemOnUndo = undoState.indexOf(undo);
      }
    }
    for (const redo of redoState) {
      if (
        redo[0] === 'strikeItem' &&
        redo[1].listId === currentListId &&
        item === redo[1].itemName
      ) {
        itemOnRedo = redoState.indexOf(redo);
      }
    }
    try {
      /** Use `strikeItem` mutation */
      const { data } = await strikeItem({
        variables: {
          data: {
            itemName: item,
            listId: currentListId
          }
        }
      });
      if (data?.strikeItem.errors) {
        errorNotification(data.strikeItem.errors, dispatch);
        mutationCooldown();
      } else {
        if (itemOnUndo) {
          dispatch({ type: 'REMOVE_UNDO', payload: itemOnUndo });
        } else if (itemOnRedo) {
          dispatch({ type: 'REMOVE_REDO', payload: itemOnRedo });
        } else {
          dispatch({
            type: 'ADD_TO_UNDO',
            payload: ['strikeItem', { itemName: item, listId: currentListId }]
          });
        }
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      console.error(`Error on strikeItem mutation: ${err}`);
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
