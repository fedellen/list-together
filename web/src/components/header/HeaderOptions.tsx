import IconButton from '../shared/IconButton';
import MoveListIcon from '../svg/headerOptions/MoveListIcon';
import LogoutIcon from '../svg/headerOptions/LogoutIcon';
import RenameListIcon from '../svg/headerOptions/RenameListIcon';
import SaveOrderIcon from '../svg/headerOptions/SaveOrderIcon';
import EditRightsIcon from '../svg/headerOptions/EditRightsIcon';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import {
  useLogoutUserMutation,
  useSubmitPreferredOrderMutation
} from 'src/generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useStateValue } from 'src/state/state';
import { openModal, sendNotification } from 'src/utils/dispatchActions';
import useCurrentPrivileges from 'src/hooks/fragmentHooks/useCurrentPrivileges';
import useCurrentSharedUsers from 'src/hooks/fragmentHooks/useCurrentSharedUsers';
import useCurrentSortedItems from 'src/hooks/fragmentHooks/useCurrentSortedItems';
import { errorNotifaction } from 'src/utils/errorNotification';

/** Modal for displaying user's list options when header menu is clicked */
export const HeaderOptions = () => {
  const [{ moveList, currentListId }, dispatch] = useStateValue();

  const currentListPrivileges = useCurrentPrivileges();
  const currentSharedLists = useCurrentSharedUsers();
  const currentSortedItems = useCurrentSortedItems();
  if (!currentListPrivileges || !currentSharedLists) return null;

  const hasSharedLists = currentSharedLists[0].shared;
  const userHasLists = currentListId !== '';

  /** logout mutation */
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutLoading }] = useLogoutUserMutation();
  const handleLogout = async () => {
    if (!logoutLoading) {
      try {
        await logout();
        // await apolloClient.clearStore();
        await apolloClient.resetStore();
        dispatch({ type: 'TOGGLE_OPTIONS' });
        dispatch({ type: 'SET_APP_STATE', payload: 'home' });
      } catch (err) {
        console.error('Error on logout mutation: ', err);
      }
    }
  };

  /** submitPreferredOrder mutation */
  const [
    submitPreferredOrder,
    { loading: submitOrderLoading }
  ] = useSubmitPreferredOrderMutation();
  const handleSaveOrder = async () => {
    if (!submitOrderLoading) {
      if (!currentSortedItems) {
        sendNotification(dispatch, [
          'There has been an error handling list data on `Save Order`'
        ]);
      } else {
        try {
          const { data } = await submitPreferredOrder({
            variables: {
              data: {
                listId: currentListId,
                removedItemArray: currentSortedItems
              }
            }
          });
          if (data?.submitPreferredOrder.errors) {
            errorNotifaction(data.submitPreferredOrder.errors, dispatch);
          } else {
            sendNotification(dispatch, [
              'Your preferred order of all items currently on the list has been saved.'
            ]);
            dispatch({ type: 'TOGGLE_OPTIONS' });
          }
        } catch (err) {
          console.error('Error on Submit Preferred Order mutation: ', err);
        }
      }
    }
  };

  return (
    <div
      id="header-options"
      className="grid absolute grid-cols-3 rounded-lg gap-2 z-30 mt-16 bg-gray-300 shadow-lg p-3 md:mr-10 lg:mr-16 xl:mr-24"
    >
      {userHasLists && (
        <IconButton
          onClick={() => dispatch({ type: 'TOGGLE_MOVE_LISTS' })}
          text={moveList ? 'End Move' : 'Move Lists'}
          style="header-option-button"
          icon={<MoveListIcon />}
          active={moveList}
          autoFocus={true}
        />
      )}
      {currentListPrivileges !== 'read' && (
        <IconButton
          onClick={() => openModal(dispatch, 'renameList')}
          text="Rename List"
          style="header-option-button"
          icon={<RenameListIcon />}
        />
      )}
      {userHasLists && currentSortedItems && (
        <IconButton
          onClick={() => handleSaveOrder()}
          text="Save Order"
          style="header-option-button"
          icon={<SaveOrderIcon />}
        />
      )}
      {userHasLists && (
        <IconButton
          onClick={() => openModal(dispatch, 'removeList')}
          text="Remove List"
          style="header-option-button"
          icon={<DeleteIcon />}
        />
      )}
      {currentListPrivileges === 'owner' && hasSharedLists && (
        <IconButton
          onClick={() => openModal(dispatch, 'editRights')}
          text="Edit Rights"
          style="header-option-button"
          icon={<EditRightsIcon />}
        />
      )}
      <IconButton
        onClick={() => handleLogout()}
        text="Logout"
        style="header-option-button"
        icon={<LogoutIcon />}
      />
    </div>
  );
};
