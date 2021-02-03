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
import StrikeIcon from '../svg/StrikeIcon';
import OptionButton from '../styled/OptionButton';
import NoteIcon from '../svg/NoteIcon';
import UpArrowIcon from '../svg/UpArrowIcon';
import DownArrowIcon from '../svg/DownArrowIcon';
import DeleteIcon from '../svg/DeleteIcon';
import { arrayMove } from 'src/utils/arrayMove';
import { useContext } from 'react';
import { ListContext } from './UsersLists';
import LoadingIcon from '../svg/LoadingIcon';

/** Modal for displaying user's item options when an item is clicked */
export const ItemOptions = () => {
  const [
    { currentListState, activeItem: itemName },
    dispatch
  ] = useStateValue();
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
              listId: currentListState.listId
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
              listId: currentListState.listId,
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
              listId: currentListState.listId
            }
          });
          if (data?.sortItems.errors) {
            errorNotifaction(data.sortItems.errors, dispatch);
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
    <div className="grid absolute opacity-90 grid-cols-3 z-20 ml-12">
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
