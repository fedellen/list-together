import {
  useDeleteListMutation,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';

export default function RemoveList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const { data, refetch } = useGetUsersListsQuery({
    notifyOnNetworkStatusChange: true
  });
  const [removeList, { loading }] = useDeleteListMutation({
    variables: { listId: currentListId }
  });
  const currentListName = data?.getUsersLists.userToList?.find(
    (list) => list.listId === currentListId
  )?.list.title;

  const handleRemoveList = async () => {
    if (!loading) {
      try {
        const { data } = await removeList();
        if (data?.deleteList.errors) {
          errorNotifaction(data.deleteList.errors, dispatch);
        } else {
          dispatch({ type: 'CLEAR_LIST' });
          refetch();
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
