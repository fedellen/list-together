import {
  // GetUsersListsDocument,
  // GetUsersListsQuery,
  // ListFragmentFragmentDoc,
  useDeleteItemsMutation,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from '../../state/state';
import Button from '../Button';
import { OptionAction } from '../../types';
import { errorNotifaction } from 'src/utils/errorNotification';
import { closeModal } from 'src/utils/closeModal';

export const ItemOptions = () => {
  const [{ currentListId, modalState, privileges }, dispatch] = useStateValue();
  const { refetch } = useGetUsersListsQuery({ skip: true });
  const [deleteItems] = useDeleteItemsMutation();

  const handleOptionAction = async (optionAction: OptionAction) => {
    if (optionAction === 'addNote') {
      dispatch({
        type: 'TOGGLE_MODAL',
        payload: { ...modalState, type: 'addNote' }
      });
    } else if (optionAction === 'deleteItem') {
      try {
        if (!modalState.itemName) {
          console.error('No item in context for deleteItem..');
        } else {
          const { data } = await deleteItems({
            variables: {
              data: {
                itemNameArray: [modalState.itemName],
                listId: currentListId
              }
            },
            update: async () => await refetch()
          });
          if (data?.deleteItems.errors) {
            errorNotifaction(data.deleteItems.errors, dispatch);
          } else {
            closeModal(dispatch);
          }
        }
      } catch (err) {
        console.error(`Error on Delete Item mutation: ${err}`);
      }
    } else if (optionAction === 'boldItem' || optionAction === 'strikeItem') {
    } else if (optionAction === 'sortItemUp') {
    } else if (optionAction === 'sortItemDown') {
    }
  };

  if (!privileges) {
    console.error('No privileges in context for ItemOptions..');
    return <div />;
  }

  return (
    <>
      {/** Display buttons user has access to */}
      {(privileges.includes('add') || privileges.includes('owner')) && (
        <Button text="Add Note" onClick={() => handleOptionAction('addNote')} />
      )}
      <Button text="Bold Item" onClick={() => handleOptionAction('boldItem')} />
      {(privileges.includes('strike') || privileges.includes('owner')) && (
        <Button
          text="Strike Item"
          onClick={() => handleOptionAction('strikeItem')}
        />
      )}
      {(privileges.includes('delete') || privileges.includes('owner')) && (
        <Button
          text="Delete Item"
          onClick={() => handleOptionAction('deleteItem')}
        />
      )}
      <Button text="Move Up" onClick={() => handleOptionAction('sortItemUp')} />
      <Button
        text="Move Down"
        onClick={() => handleOptionAction('sortItemDown')}
      />
    </>
  );
};
