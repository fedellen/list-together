import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import useDeleteItems from 'src/hooks/mutations/item/useDeleteItems';
import { useStateValue } from 'src/state/state';
import { openModal } from 'src/utils/dispatchActions';
import { KeyPair, useKeyHandler } from '../../hooks/useKeyHandler';
import IconButton from '../shared/IconButton';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import AddItemIcon from '../svg/sideMenu/AddItemIcon';
import ReviewListIcon from '../svg/sideMenu/ReviewListIcon';
import RedoButton from './RedoButton';
import UndoButton from './UndoButton';
import useStrikeItems from '../../hooks/mutations/item/useStrikeItems';

type SideMenuProps = {
  strikedItems: string[];
};

export default function SideMenu({ strikedItems }: SideMenuProps) {
  const [{ sideMenuState, currentListId }, dispatch] = useStateValue();

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  const [deleteItems, deleteItemsSubmitting] = useDeleteItems();
  const handleDeleteAllClick = () => {
    if (deleteItemsSubmitting) return;
    deleteItems(strikedItems);
  };

  const [strikeItems, strikeItemsSubmitting] = useStrikeItems();
  const handleUnStrikeAllClick = async () => {
    if (strikeItemsSubmitting) return;
    await strikeItems(strikedItems, currentListId);
    handleReturnClick();
  };

  const handleReviewClick = () => {
    dispatch({
      type: 'SET_SIDE_MENU_STATE',
      payload: 'review'
    });
  };

  const handleReturnClick = () => {
    dispatch({
      type: 'SET_SIDE_MENU_STATE',
      payload: 'add'
    });
  };

  /** Determine current list privileges to conditionally render buttons */
  const currentPrivileges = useCurrentPrivileges();
  const userCanDelete =
    currentPrivileges === 'delete' || currentPrivileges === 'owner';
  const userCanAdd = currentPrivileges !== 'read';

  const style = 'side-menu-button';
  const largeScreen = window.innerWidth > 1024;
  const hasStrikedItems = strikedItems.length > 0;

  /** Keyboard events while Side Menu is active */

  let keysToHandle: KeyPair[] = [
    { keyValues: ['n'], callback: () => openModal(dispatch, 'createList') }
  ];

  if (userCanAdd && sideMenuState === 'add') {
    keysToHandle = [
      ...keysToHandle,
      { keyValues: ['a'], callback: () => handleAddItemClick() }
    ];
  }

  if (sideMenuState === 'review') {
    keysToHandle = [
      ...keysToHandle,
      { keyValues: ['d'], callback: () => handleDeleteAllClick() }
    ];
    keysToHandle = [
      ...keysToHandle,
      { keyValues: ['u'], callback: () => handleUnStrikeAllClick() }
    ];
  }

  if (hasStrikedItems && userCanDelete) {
    keysToHandle = [
      ...keysToHandle,
      {
        keyValues: ['r'],
        callback: () =>
          sideMenuState === 'add' ? handleReviewClick() : handleReturnClick()
      }
    ];
  }

  useKeyHandler(keysToHandle);

  return (
    <div id="side-menu">
      <RedoButton />
      <UndoButton />
      {sideMenuState === 'review' ? (
        <>
          {/** Review strikes mode */}
          <IconButton
            icon={<DeleteIcon />}
            ariaLabel="Delete All Striked Items"
            onClick={handleDeleteAllClick}
            text={`Delete All${largeScreen ? ' (D)' : ''}`}
            style={style}
          />
          <IconButton
            icon={<DeleteIcon />}
            ariaLabel="Un-strike All Striked Items"
            onClick={handleUnStrikeAllClick}
            text={`Un-strike All${largeScreen ? ' (U)' : ''}`}
            style={style}
          />
          <IconButton
            icon={<ReviewListIcon />}
            ariaLabel="Return to List"
            onClick={handleReturnClick}
            text={`Return${largeScreen ? ' (R)' : ''}`}
            style={style}
          />
        </>
      ) : (
        <>
          {/** Add to list mode */}
          {hasStrikedItems && userCanDelete && (
            <IconButton
              icon={<ReviewListIcon />}
              ariaLabel="Review Striked Items"
              onClick={handleReviewClick}
              text={`Review${largeScreen ? ' (R)' : ''}`}
              style={style}
            />
          )}
          {userCanAdd && (
            <IconButton
              ariaLabel="Add New Item"
              icon={<AddItemIcon />}
              onClick={handleAddItemClick}
              text={`Add${largeScreen ? ' (A)' : ''}`}
              style={style}
            />
          )}
        </>
      )}
    </div>
  );
}
