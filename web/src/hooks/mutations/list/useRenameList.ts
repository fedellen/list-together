import { useState, useCallback } from 'react';
import { useRenameListMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { sendNotification, closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';

export default function useRenameList() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const [renameList] = useRenameListMutation();
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
          errorNotifaction(data.renameList.errors, dispatch);
          delayedFunction(() => setMutationSubmiting(false));
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error(`Error on Rename list mutation: ${err}`);
      }
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
