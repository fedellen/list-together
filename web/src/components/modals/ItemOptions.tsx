import {
  useDeleteItemsMutation,
  useStyleItemMutation
} from 'src/generated/graphql';
import { useStateValue } from '../../state/state';
import { OptionAction } from '../../types';
import { errorNotifaction } from 'src/utils/errorNotification';
import { closeModal, openModal } from 'src/utils/dispatchActions';
import StrikeIcon from '../svg/StrikeIcon';
import OptionButton from '../styled/OptionButton';
import NoteIcon from '../svg/NoteIcon';
import UpArrowIcon from '../svg/UpArrowIcon';
import DownArrowIcon from '../svg/DownArrowIcon';
import DeleteIcon from '../svg/DeleteIcon';

/** Modal for displaying user's item options when an item is clicked */
export const ItemOptions = () => {
  const [{ currentListId, privileges, activeItem }, dispatch] = useStateValue();
  const [deleteItems] = useDeleteItemsMutation();
  const [styleItem] = useStyleItemMutation();

  /** When option button is clicked */
  const handleOptionAction = async (optionAction: OptionAction) => {
    const itemName = activeItem;
    if (!itemName) {
      console.error('No item in context for deleteItem..');
    } else {
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: '' });
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
    <div className="grid  grid-cols-3 ml-auto sm:ml-8">
      {/** Display buttons when user has privileges to access them */}
      <OptionButton
        onClick={() => handleOptionAction('sortItemUp')}
        icon={<UpArrowIcon />}
      />
      {(privileges.includes('add') || privileges.includes('owner')) && (
        <OptionButton
          onClick={() => handleOptionAction('addNote')}
          icon={<NoteIcon />}
        />
      )}
      {(privileges.includes('delete') || privileges.includes('owner')) && (
        <OptionButton
          onClick={() => handleOptionAction('deleteItem')}
          icon={<DeleteIcon />}
        />
      )}

      <OptionButton
        onClick={() => handleOptionAction('sortItemDown')}
        icon={<DownArrowIcon />}
      />
      {(privileges.includes('strike') || privileges.includes('owner')) && (
        <OptionButton
          onClick={() => handleOptionAction('strikeItem')}
          icon={<StrikeIcon />}
        />
      )}
    </div>
  );
};
