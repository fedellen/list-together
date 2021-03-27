import { useStateValue } from '../../state/state';
import { OptionAction } from '../../types';
import { sendNotification } from 'src/utils/dispatchActions';
import StrikeIcon from '../svg/itemOptions/StrikeIcon';
import NoteIcon from '../svg/itemOptions/NoteIcon';
import UpArrowIcon from '../svg/itemOptions/UpArrowIcon';
import DownArrowIcon from '../svg/itemOptions/DownArrowIcon';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import IconButton from '../shared/IconButton';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import useDeleteItems from 'src/hooks/mutations/item/useDeleteItems';
import useStrikeItem from 'src/hooks/mutations/item/useStrikeItem';
import useSortItems from 'src/hooks/mutations/list/useSortItems';
import { KeyPair, useKeyHandler } from 'src/hooks/useKeyHandler';
import RenameListIcon from '../svg/headerOptions/RenameListIcon';

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
    } else if (optionAction === 'editItemName') {
      dispatch({
        type: 'TOGGLE_MODAL',
        payload: { type: 'editItemName', itemName: itemName, active: true }
      });
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

  let keysToHandle: KeyPair[] = [
    {
      keyValues: ['ArrowUp'],
      callback: () => handleOptionAction('sortItemUp')
    },
    {
      keyValues: ['ArrowDown'],
      callback: () => handleOptionAction('sortItemDown')
    },
    {
      keyValues: ['Escape'],
      callback: () => dispatch({ type: 'CLEAR_STATE' })
    }
  ];

  if (userCanAdd) {
    keysToHandle = [
      ...keysToHandle,
      {
        keyValues: ['n'],
        callback: () => handleOptionAction('addNote')
      },
      {
        keyValues: ['e'],
        callback: () => handleOptionAction('editItemName')
      }
    ];
  }

  if (userCanStrike) {
    keysToHandle = [
      ...keysToHandle,
      {
        keyValues: ['s'],
        callback: () => handleOptionAction('strikeItem')
      }
    ];
  }

  if (userCanDelete) {
    keysToHandle = [
      ...keysToHandle,
      {
        keyValues: ['d'],
        callback: () => handleOptionAction('deleteItem')
      }
    ];
  }

  useKeyHandler(keysToHandle);

  const style = 'item-option';
  const largeScreen = window.innerWidth > 1024;
  return (
    <div id="item-options-container">
      {/** Display buttons when user has privileges to access them */}
      <IconButton
        text={`Up${largeScreen ? ' (⬆)' : ''}`}
        style={style}
        ariaLabel="Sort Item Up"
        onClick={() => handleOptionAction('sortItemUp')}
        icon={<UpArrowIcon />}
        autoFocus={true}
      />
      <IconButton
        text={`Down${largeScreen ? ' (⬇)' : ''}`}
        style={style}
        ariaLabel="Sort Item Down"
        onClick={() => handleOptionAction('sortItemDown')}
        icon={<DownArrowIcon />}
      />
      {userCanAdd && (
        <>
          <IconButton
            text={`Note${largeScreen ? ' (N)' : ''}`}
            ariaLabel="Add Note to Item"
            style={style}
            onClick={() => handleOptionAction('addNote')}
            icon={<NoteIcon />}
          />
          <IconButton
            text={`Edit${largeScreen ? ' (E)' : ''}`}
            ariaLabel="Edit item name"
            style={style}
            onClick={() => handleOptionAction('editItemName')}
            icon={<RenameListIcon />}
          />
        </>
      )}
      {userCanStrike && (
        <IconButton
          text={`Strike${largeScreen ? ' (S)' : ''}`}
          ariaLabel="Strike Item"
          style={style}
          onClick={() => handleOptionAction('strikeItem')}
          icon={<StrikeIcon />}
        />
      )}
      {userCanDelete && (
        <IconButton
          text={`Delete${largeScreen ? ' (D)' : ''}`}
          ariaLabel="Delete Item"
          style={style}
          onClick={() => handleOptionAction('deleteItem')}
          icon={<DeleteIcon />}
        />
      )}
    </div>
  );
};
