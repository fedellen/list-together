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
    <div className="privilege-button">
      <span className="text-label">Privilege Level to Share:</span>
      <button
        className={`rounded-l-full  border-r-2 pl-2${
          privilege === 'read' ? ' active' : ''
        }`}
        type="button"
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
        className={`border-r-2${privilege === 'add' ? ' active' : ''}`}
      >
        <div>
          <AddItemIcon />
          <span>Add</span>
        </div>
      </button>
      <button
        type="button"
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
  );
}
