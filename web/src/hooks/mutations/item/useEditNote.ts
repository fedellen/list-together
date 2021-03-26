import { useState, useCallback } from 'react';
import { useEditNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';

export default function useEditNote() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId, listState }, dispatch] = useStateValue();
  const [editNote] = useEditNoteMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );
  const sendMutation = useCallback(async (newNote: string) => {
    if (mutationSubmiting) return;
    if (
      listState[0] !== 'modal' ||
      !listState[1].itemName ||
      !listState[1].note
    ) {
      console.error(
        'Edit note mutation cannot be used with current listState:',
        listState
      );
      return;
    }
    setMutationSubmiting(true);
    /**
     *  Edit Item Name Mutation
     */

    try {
      /** Use `editNote` mutation */
      const { data } = await editNote({
        variables: {
          data: {
            itemName: listState[1].itemName,
            listId: currentListId,
            newNote: newNote,
            note: listState[1].note
          }
        }
      });
      if (data?.editNote.errors) {
        errorNotification(data.editNote.errors, dispatch);
        mutationCooldown();
      } else {
        dispatch({
          type: 'ADD_TO_UNDO',
          payload: [
            'editNote',
            {
              itemName: listState[1].itemName,
              oldNote: listState[1].note,
              listId: currentListId,
              newNote: newNote
            }
          ]
        });
      }
      dispatch({ type: 'CLEAR_STATE' });
    } catch (err) {
      console.error(
        'An error has occurred, if this problem persists please submit an Issue on Github:',
        err
      );
      sendNotification(dispatch, [
        'Connection to the server could not be established. Interacting with the list will not function offline.'
      ]);
      dispatch({ type: 'CLEAR_STATE' });
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
