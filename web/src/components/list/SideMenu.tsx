import { useStateValue } from 'src/state/state';
import IconButton from '../styled/SideMenuButton';
import AddItemIcon from '../svg/sideMenu/AddItemIcon';
import ReviewListIcon from '../svg/sideMenu/ReviewListIcon';
import ShopIcon from '../svg/sideMenu/ShopIcon';

export default function SideMenu() {
  const [
    { activeItem, optionsOpen, sideMenuState },
    dispatch
  ] = useStateValue();

  console.log(sideMenuState);

  /** Do not show SideMenu when another menu is open */
  const visible = activeItem !== '' || optionsOpen;
  // if (activeItem !== '' || optionsOpen) return <div className="h-28" />;

  const handleAddItemClick = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    });
  };

  const style = 'side-menu-button';

  // Needs to know when list has strikes
  // Needs to know when in `shop` mode
  // Needs to know when in `review` mode

  return (
    <div id="side-menu" className={visible ? 'opacity-0' : 'opacity-100'}>
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
