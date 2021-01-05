import { List /*, useStyleItemMutation*/ } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import SingleItem from './SingleItem';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
};

export default function ItemList({ list }: ItemListProps) {
  const [{ sideMenuState }, dispatch] = useStateValue();
  // const [styleItem] = useStyleItemMutation();

  const handleItemClick = (itemName: string) => {
    if (sideMenuState === 'add') {
      dispatch({
        type: 'TOGGLE_MODAL',
        payload: { active: true, itemName: itemName, type: 'itemOptions' }
      });
    } else if (sideMenuState === 'shop') {
      /** Use strikethrough mutation */
    } else if (sideMenuState === 'sort') {
      /** Handle dragging item */
    }
  };

  return (
    <>
      {/* {toggledModal()} */}
      <div className="pl-10">
        {list.items &&
          list.items.map((i) => (
            <SingleItem
              item={i}
              key={i.name}
              handleItemClick={(itemName) => handleItemClick(itemName)}
            />
          ))}
      </div>
    </>
  );
}
