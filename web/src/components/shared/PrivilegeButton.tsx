import { UserPrivileges } from 'src/types';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import StrikeIcon from '../svg/itemOptions/StrikeIcon';
import AddItemIcon from '../svg/sideMenu/AddItemIcon';
import ReviewListIcon from '../svg/sideMenu/ReviewListIcon';

type PrivilegeButtonProps = {
  /** Currently active privilege to submit with mutation */
  privilege: UserPrivileges;
  setPrivilege: (privilege: UserPrivileges) => void;
};

export default function PrivilegeButton({
  privilege,
  setPrivilege
}: PrivilegeButtonProps) {
  return (
    <>
      <span className="text-label">Privilege Level to Share:</span>

      <div className="privilege-button">
        <button
          className={`rounded-l-full  border-r-2 pl-2${
            privilege === 'read' ? ' active' : ''
          }`}
          type="button"
          aria-label="Set Privilege Level to Read Only"
          onClick={() => setPrivilege('read')}
        >
          <div>
            <ReviewListIcon />
            <span>Read</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setPrivilege('add')}
          aria-label="Set Privilege Level to Add"
          className={`border-r-2${privilege === 'add' ? ' active' : ''}`}
        >
          <div>
            <AddItemIcon />
            <span>Add</span>
          </div>
        </button>
        <button
          type="button"
          aria-label="Set Privilege Level to Strike"
          onClick={() => setPrivilege('strike')}
          className={`border-r-2${privilege === 'strike' ? ' active' : ''}`}
        >
          <div>
            <StrikeIcon />
            <span>Strike</span>
          </div>
        </button>
        <button
          type="button"
          aria-label="Set Privilege Level to Full Access"
          onClick={() => setPrivilege('delete')}
          className={`rounded-r-full pr-2${
            privilege === 'delete' ? ' active' : ''
          }`}
        >
          <div>
            <DeleteIcon />
            <span>Full</span>
          </div>
        </button>
      </div>
    </>
  );
}
