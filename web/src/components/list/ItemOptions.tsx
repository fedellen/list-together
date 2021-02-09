import {
  useDeleteItemsMutation,
  useSortItemsMutation,
  useStyleItemMutation
} from 'src/generated/graphql';
import { useStateValue } from '../../state/state';
import { OptionAction } from '../../types';
import { errorNotifaction } from 'src/utils/errorNotification';
import {
  closeModal,
  openModal,
  sendNotification
} from 'src/utils/dispatchActions';
import StrikeIcon from '../svg/itemOptions/StrikeIcon';
import OptionButton from '../styled/OptionButton';
import NoteIcon from '../svg/itemOptions/NoteIcon';
import UpArrowIcon from '../svg/itemOptions/UpArrowIcon';
import DownArrowIcon from '../svg/itemOptions/DownArrowIcon';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import { arrayMove } from 'src/utils/arrayMove';
import { useContext } from 'react';
import { ListContext } from './UsersLists';
import LoadingIcon from '../svg/list/LoadingIcon';

/** Modal for displaying user's item options when an item is clicked */
export const ItemOptions = () => {
  const [{ currentListId, activeItem: itemName }, dispatch] = useStateValue();
  const listContext = useContext(ListContext);

  const [deleteItems, { loading: deleteLoading }] = useDeleteItemsMutation();
  const [styleItem, { loading: styleLoading }] = useStyleItemMutation();
  const [sortItems, { loading: sortLoading }] = useSortItemsMutation();

  if (!itemName || !listContext) {
    sendNotification(dispatch, [
      `Error: ItemOptions was opened without itemName: ${itemName} and/or listContext: ${listContext} `
    ]);
    return null;
  }

  /** When option button is clicked */
  const handleOptionAction = async (optionAction: OptionAction) => {
    if (optionAction === 'addNote') {
      openModal(dispatch, 'addNote', itemName);
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: '' });
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
        console.error(`Error on styleItem mutation: ${err}`);
      }
    } else if (
      optionAction === 'sortItemUp' ||
      optionAction === 'sortItemDown'
    ) {
      const currentListIndex = listContext.sortedItems.indexOf(itemName);
      const delta = optionAction === 'sortItemUp' ? -1 : 1;

      if (currentListIndex < 1 && delta === -1) {
        // if up and top
        sendNotification(dispatch, [
          'Item is already at the top of the list..'
        ]);
      } else if (
        currentListIndex > listContext.sortedItems.length - 2 &&
        delta === 1
      ) {
        // if down and bottom
        sendNotification(dispatch, [
          'Item is already at the bottom of the list..'
        ]);
      } else {
        const newSortedItemsArray = arrayMove(
          listContext.sortedItems,
          currentListIndex,
          currentListIndex + delta
        );

        try {
          /** Use `sortItems` mutation */
          const { data } = await sortItems({
            variables: {
              data: {
                stringArray: newSortedItemsArray
              },
              listId: currentListId
            }
          });
          if (data?.sortItems.errors) {
            errorNotifaction(data.sortItems.errors, dispatch);
          } else {
            setTimeout(() => {
              /** After .05 sec set Active Item to continue sorting */
              dispatch({ type: 'SET_ACTIVE_ITEM', payload: itemName });
            }, 50);
          }
        } catch (err) {
          console.error(`Error on sortItem mutation: ${err}`);
        }
      }
    } else if (optionAction === 'sortItemDown') {
    }
  };

  const privileges = listContext.privileges;
  const mutationIsLoading = styleLoading || sortLoading || deleteLoading;

  return (
    <div className="grid absolute grid-cols-3 z-20 ml-20 mt-2">
      {/** Display buttons when user has privileges to access them */}
      <OptionButton
        onClick={() => handleOptionAction('sortItemUp')}
        icon={mutationIsLoading ? <LoadingIcon /> : <UpArrowIcon />}
      />
      {(privileges.includes('add') || privileges.includes('owner')) && (
        <OptionButton
          onClick={() => handleOptionAction('addNote')}
          icon={mutationIsLoading ? <LoadingIcon /> : <NoteIcon />}
        />
      )}
      {(privileges.includes('delete') || privileges.includes('owner')) && (
        <OptionButton
          onClick={() => handleOptionAction('deleteItem')}
          icon={mutationIsLoading ? <LoadingIcon /> : <DeleteIcon />}
        />
      )}

      <OptionButton
        onClick={() => handleOptionAction('sortItemDown')}
        icon={mutationIsLoading ? <LoadingIcon /> : <DownArrowIcon />}
      />
      {(privileges.includes('strike') || privileges.includes('owner')) && (
        <OptionButton
          onClick={() => handleOptionAction('strikeItem')}
          icon={mutationIsLoading ? <LoadingIcon /> : <StrikeIcon />}
        />
      )}
    </div>
  );
};
