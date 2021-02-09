import { useStateValue } from 'src/state/state';
import IconButton from '../styled/SideMenuButton';
import AddItemIcon from '../svg/sideMenu/AddItemIcon';
import ReviewListIcon from '../svg/sideMenu/ReviewListIcon';
import ShopIcon from '../svg/sideMenu/ShopIcon';

export default function SideMenu() {
  const [, dispatch] = useStateValue();

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  const style = 'side-menu-button';

  // Needs to know when list has strikes
  // Needs to know when in `shop` mode

  return (
    <div id="side-menu">
      <IconButton
        icon={<ShopIcon />}
        onClick={handleAddItemClick}
        text="Shop"
        style={style}
      />
      <IconButton
        icon={<ReviewListIcon />}
        onClick={handleAddItemClick}
        text="Review"
        style={style}
      />
      <IconButton
        icon={<AddItemIcon />}
        onClick={handleAddItemClick}
        text="Add"
        style={style}
      />
    </div>
  );
}
