import { memo } from 'react';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import useSortItems from 'src/hooks/mutations/list/useSortItems';
import { Action } from 'src/state/reducer';
import { useStateValue } from 'src/state/state';
import { openModal, setAppState } from 'src/utils/dispatchActions';
import IconButton from '../shared/IconButton';
import LoginIcon from '../svg/headerMenu/LoginIcon';
import NewListIcon from '../svg/headerMenu/NewListIcon';
import OptionsIcon from '../svg/headerMenu/OptionsIcon';
import ShareIcon from '../svg/headerMenu/ShareIcon';
import SmartSortIcon from '../svg/headerMenu/SmartSortIcon';
import { HeaderOptions } from './HeaderOptions';

export default function HeaderMenu() {
  const [
    { listState, currentUserId, currentListId },
    dispatch
  ] = useStateValue();

  const [smartSort, smartSortSubmitting] = useSortItems();

  const handleSmartSort = () => {
    if (smartSortSubmitting) return;
    smartSort('', 'smartSort');
  };

  const optionsOpen = listState[0] === 'options';
  const isOwner = useCurrentPrivileges() === 'owner';
  const userExist = currentUserId !== '';
  const listExist = currentListId !== '';

  return (
    <HeaderMenuWithContext
      userExist={userExist}
      listExist={listExist}
      optionsOpen={optionsOpen}
      isOwner={isOwner}
      dispatch={dispatch}
      smartSort={handleSmartSort}
    />
  );
}

type HeaderMenuContextProps = {
  userExist: boolean;
  listExist: boolean;
  optionsOpen: boolean;
  isOwner: boolean;
  dispatch: React.Dispatch<Action>;
  smartSort: () => void;
};

/**
 * Wrap rendering conditionals in memo providing
 * context as props to avoid re-rendering logic needlessly
 */
const HeaderMenuWithContext = memo(function HeaderMenuWithContext({
  userExist,
  listExist,
  optionsOpen,
  isOwner,
  dispatch,
  smartSort
}: HeaderMenuContextProps) {
  const iconButtonStyle = 'header-button';
  return (
    <div id="header-menu">
      {optionsOpen && <HeaderOptions />}
      {userExist ? (
        <>
          <IconButton
            icon={<NewListIcon />}
            text="New List"
            onClick={() => openModal(dispatch, 'createList')}
            style={iconButtonStyle}
          />
          {listExist && (
            <>
              {isOwner && (
                <IconButton
                  icon={<ShareIcon />}
                  text="Share"
                  onClick={() => openModal(dispatch, 'shareList')}
                  style={iconButtonStyle}
                />
              )}
              <IconButton
                onClick={() => smartSort()}
                text="Smart Sort"
                style={iconButtonStyle}
                icon={<SmartSortIcon />}
              />
              <IconButton
                icon={<OptionsIcon />}
                text="Options"
                onClick={() => dispatch({ type: 'TOGGLE_OPTIONS' })}
                style={iconButtonStyle}
                active={optionsOpen}
              />
            </>
          )}
        </>
      ) : (
        <>
          {/**
           * Todo: This will be the darkmode toggle button for logged out users
           * Logged in users will have the darkmode toggle in `HeaderOptions`
           */}
          <IconButton
            icon={<LoginIcon />}
            text="Dark Mode"
            onClick={() => setAppState(dispatch, 'login')}
            style={iconButtonStyle}
          />
        </>
      )}
    </div>
  );
});
