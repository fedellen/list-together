import { useState } from 'react';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import PrivilegeButton from '../shared/PrivilegeButton';
import { UserPrivileges } from 'src/types';
import useCurrentListName from 'src/hooks/fragments/useCurrentListName';
import {
  SharedUsers,
  useUpdatePrivilegesMutation
} from 'src/generated/graphql';
import useCurrentSharedUsers from 'src/hooks/fragments/useCurrentSharedUsers';
import LeftArrowIcon from '../svg/list/LeftArrowIcon';
import RightArrowIcon from '../svg/list/RightArrowIcon';
import CurrentListTitle from '../shared/CurrentListTitle';

export default function EditRights() {
  const [{ currentListId }, dispatch] = useStateValue();
  const [updatePrivileges, { loading }] = useUpdatePrivilegesMutation({});

  /** State for handling the `PrivilegeButton` */
  const [privilege, setPrivilege] = useState<UserPrivileges>('delete');

  const currentListName = useCurrentListName();
  const currentSharedUsers = useCurrentSharedUsers();

  const [sharedUser, setSharedUser] = useState<SharedUsers | null>(null);
  if (!currentSharedUsers || !currentListName || !currentSharedUsers[0].email) {
    // sendNotification(dispatch, [
    //   '`EditRights` component has failed to initialize with readable cache values..'
    // ]);
    return null;
  }
  if (sharedUser === null) {
    setSharedUser(currentSharedUsers[0]);
    if (currentSharedUsers[0].privileges) {
      setPrivilege(currentSharedUsers[0].privileges as UserPrivileges);
    }
  }

  const handleArrowClick = (direction: 'left' | 'right') => {
    if (sharedUser) {
      const currentIndex = currentSharedUsers.indexOf(sharedUser);
      if (direction === 'left') {
        if (currentIndex === 0) {
          setSharedUser(currentSharedUsers[currentSharedUsers.length - 1]);
        } else {
          setSharedUser(currentSharedUsers[currentIndex - 1]);
        }
      } else if (direction === 'right') {
        if (currentIndex === currentSharedUsers.length - 1) {
          setSharedUser(currentSharedUsers[0]);
        } else {
          setSharedUser(currentSharedUsers[currentIndex + 1]);
        }
      }
    }
  };

  /** updatePrivileges Mutation */
  const handleUpdatePrivileges = async (remove = false) => {
    if (!loading && sharedUser?.email) {
      try {
        const { data } = await updatePrivileges({
          variables: {
            data: {
              listId: currentListId,
              email: sharedUser.email,
              privileges: remove ? null : privilege
            }
          }
        });
        if (data?.updatePrivileges.errors) {
          errorNotification(data.updatePrivileges.errors, dispatch);
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error in Update Privileges mutation : ', err);
      }
    }
  };

  return (
    <div className="modal-component gap-1 mt-3 sm:mt-4">
      <div className="flex flex-wrap justify-between items-center gap-x-4">
        <CurrentListTitle />
        <button
          onClick={() => handleUpdatePrivileges(true)}
          className=" rounded-full font-bold px-6 py-2 text-xs  bg-red-400  hover:bg-red-500"
        >
          Remove <br />
          All Access
        </button>
      </div>

      <span className="text-label mt-4">
        Shared User&lsquo;s Email Address:
      </span>
      <div className="flex gap-2 items-center mb-4 ">
        <button
          className="move-list-button"
          onClick={() => handleArrowClick('left')}
        >
          <LeftArrowIcon />
        </button>
        <span className="shared-email text-xs sm:text-sm md:text-base lg:text-lg font-bold overflow-x-auto ">
          {sharedUser?.email}
        </span>
        <button
          className="move-list-button "
          onClick={() => handleArrowClick('right')}
        >
          <RightArrowIcon />
        </button>
      </div>

      <PrivilegeButton privilege={privilege} setPrivilege={setPrivilege} />
      <div className="grid grid-cols-2 w-full gap-6 items-center justify-items-center px-4">
        <button
          className="button-secondary"
          onClick={() => closeModal(dispatch)}
        >
          Cancel
        </button>
        <button className="button" onClick={() => handleUpdatePrivileges()}>
          Update
        </button>
        {/* <ModalButtons
          primaryClick={() => handleUpdatePrivileges(true)}
          secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
          buttonText="Add"
        /> */}
      </div>
    </div>
  );
}
