import { useContext } from 'react';
import { useDeleteItemsMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import IconButton from '../styled/SideMenuButton';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import LoadingIcon from '../svg/list/LoadingIcon';
import AddItemIcon from '../svg/sideMenu/AddItemIcon';
import ReviewListIcon from '../svg/sideMenu/ReviewListIcon';
import { ListContext } from './UsersLists';

export default function SideMenu() {
  const [
    { activeItem, optionsOpen, sideMenuState, currentListId },
    dispatch
  ] = useStateValue();
  const listContext = useContext(ListContext);
  const [deleteItems, { loading: deleteLoading }] = useDeleteItemsMutation();

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  const handleDeleteAllClick = async () => {
    if (!listContext || listContext.strikedItems.length < 1) {
      sendNotification(dispatch, ['List has no striked items to remove..']);
    } else {
      try {
        /** Use `deleteItems` mutation */
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

  /** Do not show SideMenu when another menu is open */
  const visible = activeItem !== '' || optionsOpen;
  const hasStrikedItems =
    listContext && listContext.strikedItems.length > 0 ? true : false;
  const style = 'side-menu-button';

  return (
    <div id="side-menu" className={visible ? 'opacity-0' : 'opacity-100'}>
      {sideMenuState === 'review' ? (
        <>
          {/** Review strikes mode */}
          <IconButton
            icon={deleteLoading ? <LoadingIcon /> : <DeleteIcon />}
            onClick={handleDeleteAllClick}
            text="Delete All"
            style={style}
          />
          <IconButton
            icon={<ReviewListIcon />}
            onClick={handleReturnClick}
            text="Return"
            style={style}
          />
        </>
      ) : (
        <>
          {hasStrikedItems && (
            <IconButton
              icon={<ReviewListIcon />}
              onClick={handleReviewClick}
              text="Review"
              style={style}
            />
          )}
          <IconButton
            icon={<AddItemIcon />}
            onClick={handleAddItemClick}
            text="Add"
            style={style}
          />
        </>
      )}
    </div>
  );
}
