import { memo } from 'react';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import useSortItems from 'src/hooks/mutations/list/useSortItems';
import useDarkMode from 'src/hooks/useDarkMode';
import { Action } from 'src/state/reducer';
import { useStateValue } from 'src/state/state';
import { Theme } from 'src/types';
import { openModal } from 'src/utils/dispatchActions';
import IconButton from '../shared/IconButton';
import DarkModeIcon from '../svg/headerMenu/DarkModeIcon';
import LightModeIcon from '../svg/headerMenu/LightModeIcon';
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

  const [theme, toggleDarkMode] = useDarkMode();

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
      theme={theme}
      toggleDarkMode={toggleDarkMode}
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
  theme: Theme;
  toggleDarkMode: React.Dispatch<React.SetStateAction<Theme>>;
};

/**
 * Wrap rendering conditionals in memo providing all
 * logic as props to avoid re-rendering logic needlessly
 */
const HeaderMenuWithContext = memo(function HeaderMenuWithContext({
  userExist,
  listExist,
  optionsOpen,
  isOwner,
  dispatch,
  smartSort,
  theme,
  toggleDarkMode
}: HeaderMenuContextProps) {
  const iconButtonStyle = 'header-button';
  const isDark = theme === 'dark';
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
                <div className="hidden sm:block">
                  <IconButton
                    icon={<ShareIcon />}
                    text="Share"
                    onClick={() => openModal(dispatch, 'shareList')}
                    style={iconButtonStyle}
                  />
                </div>
              )}
              <div className="hidden md:block">
                <IconButton
                  onClick={() => smartSort()}
                  text="Smart Sort"
                  style={iconButtonStyle}
                  icon={<SmartSortIcon />}
                />
              </div>
              <IconButton
                icon={!isDark ? <DarkModeIcon /> : <LightModeIcon />}
                text={!isDark ? 'Dark' : 'Light'}
                onClick={() => toggleDarkMode(isDark ? 'light' : 'dark')}
                style={iconButtonStyle}
              />
              <IconButton
                icon={<OptionsIcon />}
                text="Options"
                onClick={() =>
                  dispatch({
                    type: optionsOpen ? 'CLEAR_STATE' : 'TOGGLE_OPTIONS'
                  })
                }
                style={iconButtonStyle}
                active={optionsOpen}
              />
            </>
          )}
        </>
      ) : (
        <>
          <IconButton
            icon={isDark ? <DarkModeIcon /> : <LightModeIcon />}
            text={isDark ? 'Dark' : 'Light'}
            onClick={() => toggleDarkMode(isDark ? 'light' : 'dark')}
            style={iconButtonStyle}
          />
        </>
      )}
    </div>
  );
});
