import { useState, useCallback } from 'react';
import { useDeleteNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { errorNotifaction } from 'src/utils/errorNotification';

export default function useDeleteNote() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId, activeNote }, dispatch] = useStateValue();
  const [deleteNote] = useDeleteNoteMutation();

  const sendMutation = useCallback(async () => {
    if (mutationSubmiting) return;
    /**
     *  Delete Note
     */
    try {
      const { data } = await deleteNote({
        variables: {
          data: {
            itemName: activeNote[0],
            listId: currentListId,
            note: activeNote[1]
          }
        }
      });
      if (data?.deleteNote.errors) {
        errorNotifaction(data.deleteNote.errors, dispatch);
        delayedFunction(() => setMutationSubmiting(false));
      } else {
        dispatch({ type: 'SET_ACTIVE_NOTE', payload: ['', ''] });
      }
    } catch (err) {
      console.error(`Error on Delete Note mutation: ${err}`);
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
