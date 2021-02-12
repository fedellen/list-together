// import { useGetUsersListsQuery } from 'src/generated/graphql';
// import { useStateValue } from '../../state/state';

import IconButton from '../styled/SideMenuButton';
import MoveListIcon from '../svg/headerOptions/MoveListIcon';
import LogoutIcon from '../svg/headerOptions/LogoutIcon';
import RenameListIcon from '../svg/headerOptions/RenameListIcon';
import SaveOrderIcon from '../svg/headerOptions/SaveOrderIcon';
// import RemoveListIcon from '../svg/headerOptions/RemoveListIcon';
import EditRightsIcon from '../svg/headerOptions/EditRightsIcon';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import { useLogoutUserMutation } from 'src/generated/graphql';
// import { setAppState } from 'src/utils/dispatchActions';
import { useApolloClient } from '@apollo/client';
import { useStateValue } from 'src/state/state';

/** Modal for displaying user's list options when header menu is clicked */
export const HeaderOptions = () => {
  const [{ moveList }, dispatch] = useStateValue();

  // Only display when user already exists
  // Needs to know if lists exist
  // Needs to know if user has `owner` and/or `add` privileges
  // Needs to know if sharedUsers exist
  // Needs to know if `moveList` is active

  // const { data: userListData } = useGetUsersListsQuery({
  //   notifyOnNetworkStatusChange: true
  // });
  // let listExist = false;
  // if (userListData?.getUsersLists.userToList) {
  //   if (userListData.getUsersLists.userToList.length > 0) {
  //     listExist = true;
  //   }
  // }

  const apolloClient = useApolloClient();
  const [logout, { loading: logoutLoading }] = useLogoutUserMutation();
  const handleLogout = async () => {
    if (!logoutLoading) {
      try {
        await logout();
        // await apolloClient.clearStore();
        await apolloClient.resetStore();
        dispatch({ type: 'TOGGLE_OPTIONS' });
      } catch (err) {
        console.error('Error on logout mutation: ', err);
      }
    }
  };

  // const handleMoveLists = () = {

  // }

  return (
    <div
      id="header-options"
      className="grid absolute grid-cols-3 rounded-lg gap-2 z-30 mt-16 bg-gray-300 shadow-lg p-3 md:mr-10 lg:mr-16 xl:mr-24"
    >
      <IconButton
        onClick={() => dispatch({ type: 'TOGGLE_MOVE_LISTS' })}
        text={moveList ? 'End Move' : 'Move Lists'}
        style="header-option-button"
        icon={<MoveListIcon />}
        active={moveList}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Rename List"
        style="header-option-button"
        icon={<RenameListIcon />}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Save Order"
        style="header-option-button"
        icon={<SaveOrderIcon />}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Remove List"
        style="header-option-button"
        icon={<DeleteIcon />}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Edit Rights"
        style="header-option-button"
        icon={<EditRightsIcon />}
      />

      <IconButton
        onClick={() => handleLogout()}
        text="Logout"
        style="header-option-button"
        icon={<LogoutIcon />}
      />
    </div>
  );
};
