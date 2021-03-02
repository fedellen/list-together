import { useEffect } from 'react';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import useStrikedItems from 'src/hooks/fragments/useStrikedItems';
import useDeleteItems from 'src/hooks/mutations/item/useDeleteItems';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import { openModal } from 'src/utils/dispatchActions';
import IconButton from '../shared/IconButton';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import AddItemIcon from '../svg/sideMenu/AddItemIcon';
import ReviewListIcon from '../svg/sideMenu/ReviewListIcon';

export default function SideMenu() {
  const [{ sideMenuState }, dispatch] = useStateValue();

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  const [deleteItems, deleteItemsSubmitting] = useDeleteItems();
  const strikedItems = useStrikedItems();
  /** Use `deleteItems` mutation on all striked items */
  const handleDeleteAllClick = () => {
    if (deleteItemsSubmitting) return;
    deleteItems(strikedItems);
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

  /** Keyboard events while Side Menu is active */

  const addKeyPress = useKeyPress('a');
  useEffect(() => {
    if (sideMenuState === 'add' && addKeyPress && userCanAdd)
      handleAddItemClick();
  }, [addKeyPress]);

  const deleteAllKeyPress = useKeyPress('d');
  useEffect(() => {
    if (sideMenuState === 'review' && deleteAllKeyPress) handleDeleteAllClick();
  }, [deleteAllKeyPress]);

  const reviewKeyPress = useKeyPress('r');
  useEffect(() => {
    if (hasStrikedItems && userCanDelete && reviewKeyPress) {
      if (sideMenuState === 'add') {
        handleReviewClick();
      } else if (sideMenuState === 'review') {
        handleReturnClick();
      }
    }
  }, [reviewKeyPress]);

  const newListKeyPress = useKeyPress('n');
  useEffect(() => {
    if (newListKeyPress) openModal(dispatch, 'createList');
  }, [newListKeyPress]);

  /** Determine current list privileges to conditionally render buttons */
  const currentPrivileges = useCurrentPrivileges();
  const userCanDelete =
    currentPrivileges === 'delete' || currentPrivileges === 'owner';
  const userCanAdd = currentPrivileges !== 'read';

  const style = 'side-menu-button';
  const largeScreen = window.innerWidth > 1024;
  const hasStrikedItems = strikedItems.length > 0;

  return (
    <div id="side-menu">
      {sideMenuState === 'review' ? (
        <>
          {/** Review strikes mode */}
          <IconButton
            icon={<DeleteIcon />}
            onClick={handleDeleteAllClick}
            text={`Delete All${largeScreen ? ' (D)' : ''}`}
            style={style}
          />
          <IconButton
            icon={<ReviewListIcon />}
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
              onClick={handleReviewClick}
              text={`Review${largeScreen ? ' (R)' : ''}`}
              style={style}
            />
          )}
          {userCanAdd && (
            <IconButton
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
