import { useState, useCallback } from 'react';
import { useAddNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { sendNotification, closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import useItemsNotes from '../../fragments/useItemsNotes';

export default function useAddNote() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ modalState, currentListId }, dispatch] = useStateValue();
  const activeItemsNotes = useItemsNotes();
  const [addNote] = useAddNoteMutation();
  const sendMutation = useCallback(async (note: string) => {
    if (mutationSubmiting) return;
    /**
     *  Add Note Mutation
     */
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
    } else if (!modalState.itemName) {
      return;
    }
    {
      setMutationSubmiting(true);
      try {
        const { data } = await addNote({
          variables: {
            data: {
              itemName: modalState.itemName,
              note: note,
              listId: currentListId
            }
          }
        });
        if (data?.addNote.errors) {
          errorNotifaction(data.addNote.errors, dispatch);
          delayedFunction(() => setMutationSubmiting(false));
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error on Add Note mutation: ', err);
      }
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
