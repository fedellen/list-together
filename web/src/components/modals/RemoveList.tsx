import {
  useDeleteListMutation,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import Button from '../styled/Button';

export default function RemoveList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const { refetch } = useGetUsersListsQuery({ skip: true });
  const [removeList, { loading }] = useDeleteListMutation({
    variables: { listId: currentListId }
  });

  const handleRemoveList = async () => {
    const { data, errors } = await removeList();
    if (errors) console.log(errors);
    if (data?.deleteList.errors) {
      errorNotifaction(data.deleteList.errors, dispatch);
    } else {
      dispatch({ type: 'CLEAR_LIST' });
      refetch();
      closeModal(dispatch);
    }
  };

  return (
    <>
      <Button text="Confirm" onClick={handleRemoveList} isLoading={loading} />
      <Button text="Cancel" onClick={() => closeModal(dispatch)} />
    </>
  );
}
