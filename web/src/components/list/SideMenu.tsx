import { useStateValue } from 'src/state/state';
import SideMenuButton from '../styled/SideMenuButton';
import AddItemIcon from '../svg/AddItemIcon';

export default function SideMenu() {
  const [, dispatch] = useStateValue();

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  return (
    <div className="sticky ml-auto xl:mx-auto bottom-0 flex justify-center z-10">
      <SideMenuButton
        icon={<AddItemIcon />}
        onClick={handleAddItemClick}
        text="Add"
        expandedText="(A)"
      />
      <SideMenuButton
        icon={<AddItemIcon />}
        onClick={handleAddItemClick}
        text="Add"
        expandedText="(A)"
      />
      <SideMenuButton
        icon={<AddItemIcon />}
        onClick={handleAddItemClick}
        text="Add"
        expandedText="(A)"
      />
      {/* <AddItemIcon />
      <AddItemIcon />
      <AddItemIcon /> */}
    </div>
  );
}
