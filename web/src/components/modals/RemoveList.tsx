import { useDeleteListMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import Button from '../Button';

export default function RemoveList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const [removeList] = useDeleteListMutation({
    variables: { listId: currentListId }
  });

  const handleRemoveList = async () => {
    const { data, errors } = await removeList();
    if (errors) console.log(errors);
    if (data?.deleteList.errors) {
      errorNotifaction(data.deleteList.errors, dispatch);
    } else {
      closeModal(dispatch);
    }
  };

  return (
    <>
      <Button text="Confirm" onClick={handleRemoveList} />
      <Button text="Cancel" onClick={() => closeModal(dispatch)} />
    </>
  );
}
