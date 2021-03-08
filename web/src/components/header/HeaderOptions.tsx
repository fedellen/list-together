import IconButton from '../shared/IconButton';
import MoveListIcon from '../svg/headerOptions/MoveListIcon';
import LogoutIcon from '../svg/headerOptions/LogoutIcon';
import RenameListIcon from '../svg/headerOptions/RenameListIcon';
import SaveOrderIcon from '../svg/headerOptions/SaveOrderIcon';
import EditRightsIcon from '../svg/headerOptions/EditRightsIcon';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import { useStateValue } from 'src/state/state';
import { openModal } from 'src/utils/dispatchActions';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import useCurrentSharedUsers from 'src/hooks/fragments/useCurrentSharedUsers';
import useCurrentSortedItems from 'src/hooks/fragments/useCurrentSortedItems';
import useLogout from 'src/hooks/mutations/user/useLogout';
import useSubmitPreferredOrder from 'src/hooks/mutations/list/useSubmitPreferredOrder';
import ShareIcon from '../svg/headerMenu/ShareIcon';

/** Modal for displaying user's list options when header menu is clicked */
export const HeaderOptions = () => {
  const [{ moveList, currentListId }, dispatch] = useStateValue();

  const currentListPrivileges = useCurrentPrivileges();
  const currentSharedLists = useCurrentSharedUsers();
  const currentSortedItems = useCurrentSortedItems();

  const hasSharedLists = currentSharedLists[0]?.shared;
  const userHasLists = currentListId !== '';
  const userCanRename = currentListPrivileges !== 'read';

  const [logout] = useLogout();
  const [saveOrder, saveOrderSubmitting] = useSubmitPreferredOrder();

  const mutationSubmitting = saveOrderSubmitting;

  const smallScreen = window.innerWidth < 400;

  return (
    <div id="header-options">
      {userHasLists && (
        <IconButton
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            dispatch({ type: 'TOGGLE_MOVE_LISTS' });
          }}
          text={moveList ? 'End Move' : 'Move Lists'}
          style="header-option-button"
          icon={<MoveListIcon />}
          active={moveList}
          autoFocus={true}
        />
      )}
      {userCanRename && (
        <IconButton
          onClick={() => openModal(dispatch, 'renameList')}
          text="Rename List"
          style="header-option-button"
          icon={<RenameListIcon />}
        />
      )}
      {userHasLists && currentSortedItems && (
        <IconButton
          onClick={() => (!mutationSubmitting ? saveOrder() : null)}
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
          onClick={() => openModal(dispatch, 'updatePrivileges')}
          text="Edit Rights"
          style="header-option-button"
          icon={<EditRightsIcon />}
        />
      )}
      {smallScreen && currentListPrivileges === 'owner' && (
        <IconButton
          icon={<ShareIcon />}
          text="Share"
          onClick={() => openModal(dispatch, 'shareList')}
          style={'header-option-button'}
        />
      )}
      <IconButton
        onClick={() => (!mutationSubmitting ? logout() : null)}
        text="Logout"
        style="header-option-button"
        icon={<LogoutIcon />}
      />
    </div>
  );
};
