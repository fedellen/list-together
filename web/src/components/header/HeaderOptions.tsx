// import { useGetUsersListsQuery } from 'src/generated/graphql';
// import { useStateValue } from '../../state/state';

import IconButton from '../styled/SideMenuButton';
import MoveListIcon from '../svg/header/MoveListIcon';
import LogoutIcon from '../svg/header/LogoutIcon';

/** Modal for displaying user's list options when header menu is clicked */
export const HeaderOptions = () => {
  // const [{ currentListId }, dispatch] = useStateValue();

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
  // const apolloClient = useApolloClient();

  // const [logout] = useLogoutUserMutation();
  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     // await apolloClient.clearStore();
  //     await apolloClient.resetStore();
  //     setAppState(dispatch, 'home');
  //   } catch (err) {
  //     console.error('Error on logout mutation: ', err);
  //   }
  // };

  return (
    <div
      id="header-options"
      className="grid absolute grid-cols-3 rounded-lg gap-2 z-20 mt-16 bg-gray-300 shadow-lg p-3"
    >
      <IconButton
        onClick={() => console.log('')}
        text="Move List"
        style="header-option-button"
        icon={<MoveListIcon />}
        // active={moveList}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Move List"
        style="header-option-button"
        icon={<MoveListIcon />}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Move List"
        style="header-option-button"
        icon={<MoveListIcon />}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Move List"
        style="header-option-button"
        icon={<MoveListIcon />}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Move List"
        style="header-option-button"
        icon={<MoveListIcon />}
      />
      <IconButton
        onClick={() => console.log('')}
        text="Logout"
        style="header-option-button"
        icon={<LogoutIcon />}
      />
    </div>
  );
};
