import { useStateValue } from '../../state/state';
import { OptionAction } from '../../types';
import { sendNotification } from 'src/utils/dispatchActions';
import StrikeIcon from '../svg/itemOptions/StrikeIcon';
import NoteIcon from '../svg/itemOptions/NoteIcon';
import UpArrowIcon from '../svg/itemOptions/UpArrowIcon';
import DownArrowIcon from '../svg/itemOptions/DownArrowIcon';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import IconButton from '../shared/IconButton';
import useKeyPress from 'src/hooks/useKeyPress';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import { useEffect } from 'react';
import useDeleteItems from 'src/hooks/mutations/item/useDeleteItems';
import useStrikeItem from 'src/hooks/mutations/item/useStrikeItem';
import useSortItems from 'src/hooks/mutations/list/useSortItems';

/** Modal for displaying user's item options when an item is clicked */
export const ItemOptions = () => {
  const [{ listState }, dispatch] = useStateValue();

  const [deleteItems, deleteSubmitting] = useDeleteItems();
  const [strikeItem, strikeSubmitting] = useStrikeItem();
  const [sortItems, sortSubmitting] = useSortItems();

  if (listState[0] !== 'item') {
    sendNotification(dispatch, [
      'Item options opened without active item in `listState`..'
    ]);
    return null;
  }
  const itemName = listState[1].name;

  const mutationLoading =
    deleteSubmitting || strikeSubmitting || sortSubmitting;

  /** When option button is clicked */
  const handleOptionAction = (optionAction: OptionAction) => {
    /** Don't run new mutation if a request is already loading */
    if (mutationLoading) {
      return;
    }
    if (optionAction === 'addNote') {
      dispatch({
        type: 'TOGGLE_MODAL',
        payload: { type: 'addNote', itemName: itemName, active: true }
      });
    } else if (optionAction === 'deleteItem') {
      deleteItems([itemName]);
    } else if (optionAction === 'strikeItem') {
      strikeItem(itemName);
    } else if (
      optionAction === 'sortItemUp' ||
      optionAction === 'sortItemDown'
    ) {
      sortItems(itemName, optionAction);
    }
  };

  const currentPrivileges = useCurrentPrivileges();

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
    if (escapeKeyPressed) dispatch({ type: 'CLEAR_STATE' });
  }, [escapeKeyPressed]);

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
