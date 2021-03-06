import { useState, useCallback } from 'react';
import { useDeleteNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
export default function useDeleteNote() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId, listState }, dispatch] = useStateValue();
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
        dispatch({ type: 'CLEAR_STATE' });
      }
    } catch (err) {
      sendNotification(dispatch, [
        'Connection to the server could not be established. Interacting with the list will not function offline.'
      ]);
      dispatch({ type: 'CLEAR_STATE' });
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
