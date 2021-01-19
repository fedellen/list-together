import {
  useDeleteItemsMutation,
  useStyleItemMutation
} from 'src/generated/graphql';
import { useStateValue } from '../../state/state';
import Button from '../Button';
import { OptionAction } from '../../types';
import { errorNotifaction } from 'src/utils/errorNotification';
import { closeModal, openModal } from 'src/utils/dispatchActions';

/** Modal for displaying user's item options when an item is clicked */
export const ItemOptions = () => {
  const [{ currentListId, modalState, privileges }, dispatch] = useStateValue();
  const [deleteItems] = useDeleteItemsMutation();
  const [styleItem] = useStyleItemMutation();

  /** When button is pushed */
  const handleOptionAction = async (optionAction: OptionAction) => {
    const itemName = modalState.itemName;
    if (!itemName) {
      console.error('No item in context for deleteItem..');
    } else {
      if (optionAction === 'addNote') {
        openModal(dispatch, 'addNote', itemName);
      } else if (optionAction === 'deleteItem') {
        try {
          /** Use `deleteItems` mutation */
          const { data } = await deleteItems({
            variables: {
              data: {
                itemNameArray: [itemName],
                listId: currentListId
              }
            }
          });
          if (data?.deleteItems.errors) {
            errorNotifaction(data.deleteItems.errors, dispatch);
          } else {
            closeModal(dispatch);
          }
        } catch (err) {
          console.error(`Error on Delete Item mutation: ${err}`);
        }
      } else if (optionAction === 'boldItem' || optionAction === 'strikeItem') {
        try {
          /** Use `styleItem` mutation */
          const { data } = await styleItem({
            variables: {
              data: {
                itemName: itemName,
                listId: currentListId,
                style: optionAction === 'boldItem' ? 'bold' : 'strike'
              }
            }
          });
          if (data?.styleItem.errors) {
            errorNotifaction(data.styleItem.errors, dispatch);
          } else {
            closeModal(dispatch);
          }
        } catch (err) {
          console.error(`Error on Delete Item mutation: ${err}`);
        }
      } else if (optionAction === 'sortItemUp') {
      } else if (optionAction === 'sortItemDown') {
      }
    }
  };

  if (!privileges) {
    console.error('No privileges in context for ItemOptions..');
    return <div />;
  }

  return (
    <>
      {/** Display buttons when user has privileges to access them */}
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
      {/** Users can always sort their lists */}
      <Button text="Move Up" onClick={() => handleOptionAction('sortItemUp')} />
      <Button
        text="Move Down"
        onClick={() => handleOptionAction('sortItemDown')}
      />
    </>
  );
};
