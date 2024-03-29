import { useState, useCallback } from 'react';
import {
  useCreateListMutation,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { minCharacterLimit } from '../../../constants';

export default function useCreateList() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const { refetch } = useGetUsersListsQuery({ skip: true });
  const [, dispatch] = useStateValue();
  const [createList] = useCreateListMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );
  const sendMutation = useCallback(async (title: string) => {
    if (mutationSubmiting) return;
    /**
     *  Create List Mutation
     */

    // Front-end validation for `createList`
    if (title.length < minCharacterLimit) {
      sendNotification(dispatch, [
        'List title length must contain 1 or more character..'
      ]);
      return;
    } else if (title.length > 55) {
      sendNotification(dispatch, [
        'List title must contain 55 characters or less..'
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
          errorNotification(data.createList.errors, dispatch);
          mutationCooldown();
        } else {
          await refetch();
          const newListId = data?.createList.userToList?.listId;
          dispatch({ type: 'SET_LIST', payload: newListId ? newListId : '' });
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
