import { useState, useCallback } from 'react';
import { useDeleteNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
export default function useDeleteNote() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [
    { currentListId, listState, undoState, redoState },
    dispatch
  ] = useStateValue();
  const [deleteNote] = useDeleteNoteMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );

  const sendMutation = useCallback(async () => {
    if (listState[0] !== 'note') {
      sendNotification(dispatch, [
        'Error: Cannot sendMutation in `useDeleteNotes`, there is no active note in `listState`..'
      ]);
      return;
    }
    if (mutationSubmiting) return;
    setMutationSubmiting(true);
    /**
     *  Delete Note
     */
    /** Index of item on undoState? */
    let itemOnUndo: number | null = null;
    /** Index of item on redoState? */
    let itemOnRedo: number | null = null;
    for (const undo of undoState) {
      if (
        undo[0] === 'addNote' &&
        undo[1].listId === currentListId &&
        listState[1].item === undo[1].itemName &&
        listState[1].note === undo[1].note
      ) {
        itemOnUndo = undoState.indexOf(undo);
      }
    }
    for (const redo of redoState) {
      if (
        redo[0] === 'deleteNote' &&
        redo[1].listId === currentListId &&
        listState[1].item === redo[1].itemName &&
        listState[1].note === redo[1].note
      ) {
        itemOnRedo = redoState.indexOf(redo);
      }
    }
    try {
      const { data } = await deleteNote({
        variables: {
          data: {
            itemName: listState[1].item,
            listId: currentListId,
            note: listState[1].note
          }
        }
      });
      if (data?.deleteNote.errors) {
        errorNotification(data.deleteNote.errors, dispatch);
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
              'deleteNote',
              {
                itemName: listState[1].item,
                note: listState[1].note,
                listId: currentListId
              }
            ]
          });
        }
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      console.error(`Error on Delete Note mutation: ${err}`);
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
