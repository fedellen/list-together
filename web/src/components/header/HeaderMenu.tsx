import { useApolloClient } from '@apollo/client';
import {
  useLogoutUserMutation,
  useGetUserQuery,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { openModal, setAppState } from 'src/utils/dispatchActions';
import SideMenuButton from '../styled/SideMenuButton';
import LoginIcon from '../svg/header/LoginIcon';
import NewListIcon from '../svg/header/NewListIcon';
import NewUserIcon from '../svg/header/NewUserIcon';
import OptionsIcon from '../svg/header/OptionsIcon';
import ShareIcon from '../svg/header/ShareIcon';

export default function HeaderMenu() {
  const [, dispatch] = useStateValue();
  const [logout] = useLogoutUserMutation();
  const { data: userData } = useGetUserQuery({
    notifyOnNetworkStatusChange: true
  });
  const { data: userListData } = useGetUsersListsQuery({
    notifyOnNetworkStatusChange: true
  });

  const apolloClient = useApolloClient();

  const handleLogout = async () => {
    try {
      await logout();
      // await apolloClient.clearStore();
      await apolloClient.resetStore();
      setAppState(dispatch, 'home');
    } catch (err) {
      console.error('Error on logout mutation: ', err);
    }
  };

  const userExist = userData?.getUser?.username;
  let listExist = false;
  if (userListData?.getUsersLists.userToList) {
    if (userListData.getUsersLists.userToList.length > 0) {
      listExist = true;
    }
  }

  // Needs to know when user exists, and if list exists
  return (
    <div id="header-menu">
      {userExist ? (
        <>
          <SideMenuButton
            icon={<NewListIcon />}
            text="New List"
            onClick={handleLogout}
            header={true}
          />
          {listExist && (
            <>
              <SideMenuButton
                icon={<ShareIcon />}
                text="Share"
                onClick={() => openModal(dispatch, 'shareList')}
                header={true}
              />
              <SideMenuButton
                icon={<OptionsIcon />}
                text="Options"
                onClick={handleLogout}
                header={true}
              />
            </>
          )}
        </>
      ) : (
        <>
          <SideMenuButton
            icon={<LoginIcon />}
            text="Login"
            onClick={() => setAppState(dispatch, 'login')}
            header={true}
          />
          <SideMenuButton
            icon={<NewUserIcon />}
            text="New User"
            onClick={() => setAppState(dispatch, 'createUser')}
            header={true}
          />
        </>
      )}
    </div>
  );
}
