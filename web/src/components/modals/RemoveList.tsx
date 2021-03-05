import {
  useDeleteListMutation,
  useGetUserQuery,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useCurrentListName from 'src/hooks/fragments/useCurrentListName';

export default function RemoveList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const { refetch: refetchLists } = useGetUsersListsQuery({ skip: true });
  const { data: userData, refetch: refetchUser } = useGetUserQuery({
    skip: true
  });

  const currentListName = useCurrentListName();

  const [removeList, { loading }] = useDeleteListMutation({
    variables: { listId: currentListId }
  });

  const handleRemoveList = async () => {
    if (!loading) {
      try {
        const { data } = await removeList();
        if (data?.deleteList.errors) {
          errorNotification(data.deleteList.errors, dispatch);
        } else {
          await refetchUser();
          await refetchLists();
          const sortedListsArray = userData?.getUser?.sortedListsArray;
          const newListId = sortedListsArray ? sortedListsArray[0] : '';
          dispatch({ type: 'SET_LIST', payload: newListId });
        }
      } catch (err) {
        console.error('Error in Remove List mutation : ', err);
      }
    }
  };

  return (
    <div className="remove-confirmation">
      <p>This action cannot be undone.</p>
      <span>{`" ${currentListName} "`}</span>
      <button onClick={() => closeModal(dispatch)} className="button-secondary">
        Cancel
      </button>
      <button onClick={() => handleRemoveList()} className="button">
        Remove
      </button>
    </div>
  );
}
