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
      const { data, errors } = await removeList();
      if (errors) console.log(errors);
      if (data?.deleteList.errors) {
        errorNotifaction(data.deleteList.errors, dispatch);
      } else {
        dispatch({ type: 'CLEAR_LIST' });
        refetch();
        closeModal(dispatch);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-7 mt-2 text-lg  ">
      <span className="col-span-2 px-4 font-semibold">
        Are you sure you want to remove this list?
      </span>
      <span className="text-2xl col-span-2 text-center mb-4 font-extrabold text-indigo-700">
        {currentListName}
      </span>
      <button
        onClick={() => closeModal(dispatch)}
        className="button z-10 py-2 px-6 rounded-full font-semibold hover:bg-indigo-300 hover:shadow-md "
      >
        Cancel
      </button>
      <button
        onClick={() => handleRemoveList}
        className="button-secondary z-10 py-2 px-6 rounded-full font-semibold  shadow-md  bg-indigo-300   hover:bg-indigo-400 "
      >
        Remove List
      </button>
    </div>
  );
}
