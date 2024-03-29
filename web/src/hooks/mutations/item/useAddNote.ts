import { useState, useCallback } from 'react';
import { useAddNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useItemsNotes from '../../fragments/useItemsNotes';
import { maxCharacterLimit, minCharacterLimit } from '../../../constants';

export default function useAddNote() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ listState, currentListId }, dispatch] = useStateValue();
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

    // Front-end validation for `addNote`
    if (activeItemsNotes.includes(note)) {
      sendNotification(dispatch, [`That item already includes "${note}"..`]);
      return;
    } else if (note.length < minCharacterLimit) {
      sendNotification(dispatch, [
        'Item length must contain 1 or more characters..'
      ]);
      return;
    } else if (note.length > maxCharacterLimit) {
      sendNotification(dispatch, [
        'Item length must contain 255 characters or less..'
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
