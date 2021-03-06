import {
  useDeleteListMutation,
  useGetUserQuery,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import ModalButtons from './ModalButtons';
import CurrentListTitle from '../shared/CurrentListTitle';
import { useState } from 'react';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import useKeyPress from 'src/hooks/useKeyPress';

export default function RemoveList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const { refetch: refetchLists } = useGetUsersListsQuery({ skip: true });
  const { refetch: refetchUser } = useGetUserQuery({ skip: true });

  const [removeList, { loading }] = useDeleteListMutation({
    variables: { listId: currentListId }
  });

  const [submit, setSubmit] = useState(false);
  const delayMutation = useDelayedFunction(() => setSubmit(false));
  const handleRemoveList = async () => {
    if (!loading && !submit) {
      setSubmit(true);
      try {
        const { data } = await removeList();
        if (data?.deleteList.errors) {
          errorNotification(data.deleteList.errors, dispatch);
          delayMutation(1000); // 1 second
        } else {
          await refetchUser();
          await refetchLists();
          const sortedListsArray = data?.deleteList.user?.sortedListsArray;
          dispatch({
            type: 'SET_LIST',
            payload:
              sortedListsArray && sortedListsArray.length > 0
                ? sortedListsArray[0]
                : ''
          });
        }
      } catch (err) {
        console.error('Error in Remove List mutation : ', err);
      }
    }
  };

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleRemoveList();

  return (
    <div className="modal-component items-center">
      <CurrentListTitle />
      <span className="my-4 sm:my-6 lg:my-8 font-bold">
        This action cannot be undone!
      </span>

      <ModalButtons
        primaryClick={() => handleRemoveList()}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Remove"
      />
    </div>
  );
}
