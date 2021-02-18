import { useContext, useEffect } from 'react';
import { useDeleteItemsMutation } from 'src/generated/graphql';
import useCurrentPrivileges from 'src/hooks/useCurrentPrivileges';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import { openModal, sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import IconButton from '../shared/IconButton';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import LoadingIcon from '../svg/list/LoadingIcon';
import AddItemIcon from '../svg/sideMenu/AddItemIcon';
import ReviewListIcon from '../svg/sideMenu/ReviewListIcon';
import { ListContext } from './UsersLists';

export default function SideMenu() {
  const [
    { modalState, activeItem, optionsOpen, sideMenuState, currentListId },
    dispatch
  ] = useStateValue();
  const listContext = useContext(ListContext);
  const [deleteItems, { loading: deleteLoading }] = useDeleteItemsMutation();

  const sideMenuActive =
    activeItem === '' && !optionsOpen && modalState.active === false;

  const currentPrivileges = useCurrentPrivileges();
  const hasStrikedItems =
    listContext && listContext.strikedItems.length > 0 ? true : false;
  const userCanDelete =
    currentPrivileges === 'delete' || currentPrivileges === 'owner';
  const userCanAdd = currentPrivileges !== 'read';

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  /** Use `deleteItems` mutation on all striked items */
  const handleDeleteAllClick = async () => {
    if (!listContext || listContext.strikedItems.length < 1) {
      sendNotification(dispatch, ['List has no striked items to remove..']);
    } else {
      try {
        const { data } = await deleteItems({
          variables: {
            data: {
              itemNameArray: listContext.strikedItems,
              listId: currentListId
            }
          }
        });
        if (data?.deleteItems.errors) {
          errorNotifaction(data.deleteItems.errors, dispatch);
        } else {
          dispatch({ type: 'SET_SIDE_MENU_STATE', payload: 'add' });
          sendNotification(dispatch, ['All striked items have been deleted']);
        }
      } catch (err) {
        console.error(`Error on Delete Item mutation: ${err}`);
      }
    }
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
    if (sideMenuActive && sideMenuState === 'add' && addKeyPress && userCanAdd)
      handleAddItemClick();
  }, [addKeyPress]);

  const deleteAllKeyPress = useKeyPress('d');
  useEffect(() => {
    if (sideMenuActive && sideMenuState === 'review' && deleteAllKeyPress)
      handleDeleteAllClick();
  }, [deleteAllKeyPress]);

  const reviewKeyPress = useKeyPress('r');
  useEffect(() => {
    if (sideMenuActive && hasStrikedItems && userCanDelete && reviewKeyPress) {
      if (sideMenuState === 'add') {
        handleReviewClick();
      } else if (sideMenuState === 'review') {
        handleReturnClick();
      }
    }
  }, [reviewKeyPress]);

  const newListKeyPress = useKeyPress('n');
  useEffect(() => {
    if (sideMenuActive && newListKeyPress) openModal(dispatch, 'createList');
  }, [newListKeyPress]);

  const style = 'side-menu-button';
  const largeScreen = window.innerWidth > 1024;

  return (
    <div
      id="side-menu"
      /** Do not show SideMenu when another menu is open */
      className={
        !sideMenuActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }
    >
      {sideMenuState === 'review' ? (
        <>
          {/** Review strikes mode */}
          <IconButton
            icon={deleteLoading ? <LoadingIcon /> : <DeleteIcon />}
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
