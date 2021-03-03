import { useState, useCallback } from 'react';
import {
  useCreateListMutation,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import delayedFunction from 'src/utils/delayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';

export default function useCreateList() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const { refetch } = useGetUsersListsQuery({ skip: true });
  const [, dispatch] = useStateValue();
  const [createList] = useCreateListMutation();
  const sendMutation = useCallback(async (title: string) => {
    if (mutationSubmiting) return;
    /**
     *  Create List Mutation
     */

    // Front-end validation for `createList`
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
      setMutationSubmiting(true);
      try {
        const { data } = await createList({
          variables: {
            title: title
          }
        });
        if (data?.createList.errors) {
          errorNotifaction(data.createList.errors, dispatch);
          delayedFunction(() => setMutationSubmiting(false));
        } else {
          await refetch();
          const newListId = data?.createList.userToList?.listId;
          dispatch({ type: 'SET_LIST', payload: newListId ? newListId : '' });
        }
      } catch (err) {
        console.error(`Error on Create list mutation: ${err}`);
      }
    }
  }, []);

  return [sendMutation, mutationSubmiting] as const;
}
