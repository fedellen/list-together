import { useStateValue } from 'src/state/state';
import SideMenuButton from '../styled/SideMenuButton';
import AddItemIcon from '../svg/AddItemIcon';
import ReviewListIcon from '../svg/ReviewListIcon';
import ShopIcon from '../svg/ShopIcon';

export default function SideMenu() {
  const [, dispatch] = useStateValue();

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  return (
    <div id="side-menu">
      <SideMenuButton
        icon={<ShopIcon />}
        onClick={handleAddItemClick}
        text="Shop"
      />
      <SideMenuButton
        icon={<ReviewListIcon />}
        onClick={handleAddItemClick}
        text="Review"
      />
      <SideMenuButton
        icon={<AddItemIcon />}
        onClick={handleAddItemClick}
        text="Add"
      />
    </div>
  );
}
