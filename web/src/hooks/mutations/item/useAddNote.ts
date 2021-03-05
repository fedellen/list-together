import { useState, useCallback } from 'react';
import { useAddNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useItemsNotes from '../../fragments/useItemsNotes';

export default function useAddNote() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [
    { listState, currentListId, undoState, redoState },
    dispatch
  ] = useStateValue();
  const activeItemsNotes = useItemsNotes();
  const [addNote] = useAddNoteMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );

  const sendMutation = useCallback(async (note: string) => {
    if (listState[0] !== 'modal' || !listState[1].itemName) {
      sendNotification(dispatch, [
        'Error: Cannot sendMutation in `useDeleteNotes`, there is no active note or itemName in `listState`..'
      ]);
      return;
    }
    if (mutationSubmiting) return;
    /**
     *  Add Note Mutation
     */
    /** Index of item on undoState? */
    let itemOnUndo: number | null = null;
    /** Index of item on redoState? */
    let itemOnRedo: number | null = null;
    for (const undo of undoState) {
      if (
        undo[0] === 'deleteNote' &&
        undo[1].listId === currentListId &&
        undo[1].itemName === listState[1].itemName &&
        undo[1].note === note
      ) {
        itemOnUndo = undoState.indexOf(undo);
      }
    }
    for (const redo of redoState) {
      if (
        redo[0] === 'deleteNote' &&
        redo[1].listId === currentListId &&
        redo[1].itemName === listState[1].itemName &&
        redo[1].note === note
      ) {
        itemOnRedo = redoState.indexOf(redo);
      }
    }
    // Front-end validation for `addNote`
    if (activeItemsNotes.includes(note)) {
      sendNotification(dispatch, [`That item already includes "${note}"..`]);
      return;
    } else if (note.length < 2) {
      sendNotification(dispatch, [
        'Item length must contain 2 or more characters..'
      ]);
      return;
    } else if (note.length > 30) {
      sendNotification(dispatch, [
        'Item length must contain 30 characters or less..'
      ]);
      return;
    }

    {
      setMutationSubmiting(true);
      try {
        const { data } = await addNote({
          variables: {
            data: {
              itemName: listState[1].itemName,
              note: note,
              listId: currentListId
            }
          }
        });
        if (data?.addNote.errors) {
          errorNotification(data.addNote.errors, dispatch);
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
                'addNote',
                {
                  itemName: listState[1].itemName,
                  note: note,
                  listId: currentListId
                }
              ]
            });
          }
          dispatch({ type: 'CLEAR_STATE' });
        }
      } catch (err) {
        console.error('Error on Add Note mutation: ', err);
      }
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
