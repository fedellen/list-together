import { useState, useCallback } from 'react';
import { useRenameListMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { sendNotification, closeModal } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

export default function useRenameList() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const [renameList] = useRenameListMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );
  const sendMutation = useCallback(async (title: string) => {
    if (mutationSubmiting) return;
    /**
     *  Rename List Mutation
     */

    // Front-end validation for `renameList`
    if (title.length < 2) {
      sendNotification(dispatch, [
        'List title length must contain 2 or more characters..'
      ]);
      return;
    } else if (title.length > 30) {
      sendNotification(dispatch, [
        'List title must contain 30 characters or less..'
      ]);
      return;
    } else {
      try {
        const { data } = await renameList({
          variables: {
            name: title,
            listId: currentListId
          }
        });
        if (data?.renameList.errors) {
          errorNotification(data.renameList.errors, dispatch);
          mutationCooldown();
        } else {
          closeModal(dispatch);
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
