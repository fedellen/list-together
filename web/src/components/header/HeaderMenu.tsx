// import { useApolloClient } from '@apollo/client';
import React from 'react';
import { useGetUserQuery, useGetUsersListsQuery } from 'src/generated/graphql';
import useCurrentPrivileges from 'src/hooks/fragmentHooks/useCurrentPrivileges';
import { useStateValue } from 'src/state/state';
import { openModal, setAppState } from 'src/utils/dispatchActions';
import IconButton from '../shared/IconButton';
import LoginIcon from '../svg/headerMenu/LoginIcon';
import NewListIcon from '../svg/headerMenu/NewListIcon';
import NewUserIcon from '../svg/headerMenu/NewUserIcon';
import OptionsIcon from '../svg/headerMenu/OptionsIcon';
import ShareIcon from '../svg/headerMenu/ShareIcon';
import SmartSortIcon from '../svg/headerMenu/SmartSortIcon';
import { HeaderOptions } from './HeaderOptions';

export default function HeaderMenu() {
  const [{ optionsOpen }, dispatch] = useStateValue();

  const { data: userData } = useGetUserQuery({
    notifyOnNetworkStatusChange: true
  });
  const { data: userListData } = useGetUsersListsQuery({
    notifyOnNetworkStatusChange: true
  });

  const isOwner = useCurrentPrivileges() === 'owner';

  const userExist = userData?.getUser?.username;
  let listExist = false;
  if (userListData?.getUsersLists.userToList) {
    if (userListData.getUsersLists.userToList.length > 0) {
      listExist = true;
    }
  }

  const style = 'header-button';
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
            style={style}
          />
          {listExist && (
            <>
              {isOwner && (
                <IconButton
                  icon={<ShareIcon />}
                  text="Share"
                  onClick={() => openModal(dispatch, 'shareList')}
                  style={style}
                />
              )}
              <IconButton
                onClick={() => console.log('')}
                text="Smart Sort"
                style={style}
                icon={<SmartSortIcon />}
              />
              <IconButton
                icon={<OptionsIcon />}
                text="Options"
                onClick={() => dispatch({ type: 'TOGGLE_OPTIONS' })}
                style={style}
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
            style={style}
          />
          <IconButton
            icon={<NewUserIcon />}
            text="New User"
            onClick={() => setAppState(dispatch, 'createUser')}
            style={style}
          />
        </>
      )}
    </div>
  );
}
