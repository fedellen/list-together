import {
  useDeleteListMutation,
  useGetUserQuery,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import useCurrentListName from 'src/hooks/fragmentHooks/useCurrentListName';

export default function RemoveList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const { refetch: refetchLists } = useGetUsersListsQuery({ skip: true });
  const { refetch: refetchUser } = useGetUserQuery({ skip: true });

  const currentListName = useCurrentListName();

  const [removeList, { loading }] = useDeleteListMutation({
    variables: { listId: currentListId }
  });

  const handleRemoveList = async () => {
    if (!loading) {
      try {
        const { data } = await removeList();
        if (data?.deleteList.errors) {
          errorNotifaction(data.deleteList.errors, dispatch);
        } else {
          await refetchUser();
          await refetchLists();
          console.log('clearing that list mon');
          dispatch({ type: 'CLEAR_LIST' });
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error in Remove List mutation : ', err);
      }
    }
  };

  return (
    <div className="remove-confirmation">
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
