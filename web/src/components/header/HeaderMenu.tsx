// import { useApolloClient } from '@apollo/client';
import {
  // useLogoutUserMutation,
  useGetUserQuery,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { openModal, setAppState } from 'src/utils/dispatchActions';
import IconButton from '../styled/SideMenuButton';
import LoginIcon from '../svg/header/LoginIcon';
import NewListIcon from '../svg/header/NewListIcon';
import NewUserIcon from '../svg/header/NewUserIcon';
import OptionsIcon from '../svg/header/OptionsIcon';
import ShareIcon from '../svg/header/ShareIcon';
import { HeaderOptions } from './HeaderOptions';

export default function HeaderMenu() {
  const [{ optionsOpen }, dispatch] = useStateValue();

  const { data: userData } = useGetUserQuery({
    notifyOnNetworkStatusChange: true
  });
  const { data: userListData } = useGetUsersListsQuery({
    notifyOnNetworkStatusChange: true
  });

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
      {optionsOpen && <HeaderOptions />}
      {userExist ? (
        <>
          <IconButton
            icon={<NewListIcon />}
            text="New List"
            onClick={() => openModal(dispatch, 'createList')}
            style="header-button"
          />
          {listExist && (
            <>
              <IconButton
                icon={<ShareIcon />}
                text="Share"
                onClick={() => openModal(dispatch, 'shareList')}
                style="header-button"
              />
              <IconButton
                icon={<OptionsIcon />}
                text="Options"
                onClick={() => dispatch({ type: 'TOGGLE_OPTIONS' })}
                style="header-button"
                active={optionsOpen}
              />
            </>
          )}
        </>
      ) : (
        <>
          <IconButton
            icon={<LoginIcon />}
            text="Login"
            onClick={() => setAppState(dispatch, 'login')}
            style="header-button"
          />
          <IconButton
            icon={<NewUserIcon />}
            text="New User"
            onClick={() => setAppState(dispatch, 'createUser')}
            style="header-button"
          />
        </>
      )}
    </div>
  );
}
