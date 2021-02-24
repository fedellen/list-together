import {
  useDeleteItemsMutation,
  useSortItemsMutation,
  useStrikeItemMutation
} from 'src/generated/graphql';
import { useStateValue } from '../../state/state';
import { OptionAction } from '../../types';
import { errorNotifaction } from 'src/utils/errorNotification';
import {
  openModal,
  resetActiveItem,
  sendNotification
} from 'src/utils/dispatchActions';
import StrikeIcon from '../svg/itemOptions/StrikeIcon';
import NoteIcon from '../svg/itemOptions/NoteIcon';
import UpArrowIcon from '../svg/itemOptions/UpArrowIcon';
import DownArrowIcon from '../svg/itemOptions/DownArrowIcon';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import { arrayMove } from 'src/utils/arrayMove';
import IconButton from '../shared/IconButton';
import useKeyPress from 'src/hooks/useKeyPress';
import useCurrentSortedItems from 'src/hooks/useCurrentSortedItems';
import useCurrentPrivileges from 'src/hooks/useCurrentPrivileges';
import { useEffect, useState } from 'react';

/** Modal for displaying user's item options when an item is clicked */
export const ItemOptions = () => {
  const [{ currentListId, activeItem: itemName }, dispatch] = useStateValue();
  // const listContext = useContext(ListContext);
  const currentSortedItems = useCurrentSortedItems();
  const currentPrivileges = useCurrentPrivileges();

  const [deleteItems] = useDeleteItemsMutation();
  const [strikeItem] = useStrikeItemMutation();
  const [sortItems] = useSortItemsMutation();

  const [mutationLoading, setMutationLoading] = useState(false);

  if (!itemName) {
    sendNotification(dispatch, [
      `Error: ItemOptions was opened without itemName: ${itemName}  `
    ]);
    return null;
  }

  /** When option button is clicked */
  const handleOptionAction = async (optionAction: OptionAction) => {
    /** Don't run new mutation if a request is already loading */
    if (mutationLoading) {
      return;
    }
    setMutationLoading(true);

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
        }
      } catch (err) {
        console.error(`Error on Delete Item mutation: ${err}`);
      }
      setMutationLoading(false);
    } else if (optionAction === 'boldItem' || optionAction === 'strikeItem') {
      try {
        /** Use `strikeItem` mutation */
        const { data } = await strikeItem({
          variables: {
            data: {
              itemName: itemName,
              listId: currentListId
            }
          }
        });
        if (data?.strikeItem.errors) {
          errorNotifaction(data.strikeItem.errors, dispatch);
        } else {
          resetActiveItem(dispatch);
        }
      } catch (err) {
        console.error(`Error on strikeItem mutation: ${err}`);
      }
      setMutationLoading(false);
    } else if (
      optionAction === 'sortItemUp' ||
      optionAction === 'sortItemDown'
    ) {
      if (!currentSortedItems) {
        sendNotification(dispatch, [
          'There has been an error reading your sorted items from the cache..'
        ]);
        return;
      }

      const currentListIndex = currentSortedItems.indexOf(itemName);
      const delta = optionAction === 'sortItemUp' ? -1 : 1;

      if (currentListIndex < 1 && delta === -1) {
        // if up clicked and already on top of list
        sendNotification(dispatch, [
          'That item is already at the top of the list..'
        ]);
      } else if (
        currentListIndex > currentSortedItems.length - 2 &&
        delta === 1
      ) {
        // if down clicked and already on bottom of list
        sendNotification(dispatch, [
          'That item is already at the bottom of the list..'
        ]);
      } else {
        const newSortedItemsArray = arrayMove(
          currentSortedItems,
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
          }
        } catch (err) {
          console.error(`Error on sortItem mutation: ${err}`);
        }
        setMutationLoading(false);
      }
    }
  };
  const userCanAdd = currentPrivileges !== 'read';
  const userCanStrike =
    currentPrivileges !== 'read' && currentPrivileges !== 'add';
  const userCanDelete =
    currentPrivileges === 'delete' || currentPrivileges === 'owner';

  /** Keyboard access for mutations */

  const moveUpKeyPressed = useKeyPress('ArrowUp');
  if (moveUpKeyPressed && !mutationLoading) handleOptionAction('sortItemUp');

  const moveDownKeyPressed = useKeyPress('ArrowDown');
  if (moveDownKeyPressed && !mutationLoading)
    handleOptionAction('sortItemDown');

  const strikeKeyPressed = userCanStrike && useKeyPress('s');
  if (strikeKeyPressed && !mutationLoading) handleOptionAction('strikeItem');

  const deleteKeyPressed = userCanDelete && useKeyPress('d');
  if (deleteKeyPressed && !mutationLoading) handleOptionAction('deleteItem');

  const noteKeyPressed = userCanAdd && useKeyPress('n');
  useEffect(() => {
    // Note key press results in an immediate dispatch, wrap in a useEffect
    if (noteKeyPressed && !mutationLoading) handleOptionAction('addNote');
  }, [noteKeyPressed]);

  const escapeKeyPressed = useKeyPress('Escape');
  useEffect(() => {
    // Close item Modal
    if (escapeKeyPressed) dispatch({ type: 'SET_ACTIVE_ITEM', payload: '' });
  });

  const style = 'item-option';
  return (
    <div id="item-options-container">
      {/** Display buttons when user has privileges to access them */}
      <IconButton
        text="Up"
        style={style}
        onClick={() => handleOptionAction('sortItemUp')}
        icon={<UpArrowIcon />}
        autoFocus={true}
      />
      <IconButton
        text="Down"
        style={style}
        onClick={() => handleOptionAction('sortItemDown')}
        icon={<DownArrowIcon />}
      />
      {userCanAdd && (
        <IconButton
          text="Note"
          style={style}
          onClick={() => handleOptionAction('addNote')}
          icon={<NoteIcon />}
        />
      )}
      {userCanStrike && (
        <IconButton
          text="Strike"
          style={style}
          onClick={() => handleOptionAction('strikeItem')}
          icon={<StrikeIcon />}
        />
      )}
      {userCanDelete && (
        <IconButton
          text="Delete"
          style={style}
          onClick={() => handleOptionAction('deleteItem')}
          icon={<DeleteIcon />}
        />
      )}
    </div>
  );
};
