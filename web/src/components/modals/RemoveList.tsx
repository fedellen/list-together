import {
  useDeleteListMutation,
  useGetUserQuery,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import ModalButtons from './ModalButtons';
import CurrentListTitle from '../shared/CurrentListTitle';

export default function RemoveList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const { refetch: refetchLists } = useGetUsersListsQuery({ skip: true });
  const { refetch: refetchUser } = useGetUserQuery({ skip: true });

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

  return (
    <div className="modal-component">
      <CurrentListTitle />
      <span className="mb-6 font-bold">This action cannot be undone!</span>

      <ModalButtons
        primaryClick={() => handleRemoveList()}
        secondaryClick={() => dispatch({ type: 'CLEAR_LIST' })}
        buttonText="Remove"
      />
    </div>
  );
}
