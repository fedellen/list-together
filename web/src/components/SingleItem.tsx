import { Item } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { openModal } from 'src/utils/dispatchActions';

type SingleItemProps = {
  item: Item;
};

export default function SingleItem({ item }: SingleItemProps) {
  const [{ sideMenuState, modalState }, dispatch] = useStateValue();
  // const [styleItem] = useStyleItemMutation();

  const handleItemClick = (itemName: string) => {
    if (sideMenuState === 'add') {
      openModal(dispatch, 'itemOptions', itemName);
    } else if (sideMenuState === 'shop') {
      /** Use strikethrough mutation */
    } else if (sideMenuState === 'sort') {
      /** Handle dragging item */
    }
  };

  const activeItem = modalState.active && modalState.itemName === item.name;

  return (
    <li>
      <button
        onClick={() => handleItemClick(item.name)}
        className={`
          text-2xl font-semibold py-1 
          ${item.strike && 'line-through'} 
          ${activeItem && 'underline text-light font-bold'}
        `}
      >
        {item.name}
      </button>
      {activeItem && <div>Item Options</div>}
      {item.notes && (
        <ul className="list-decimal list-inside">
          {item.notes.map((note) => (
            <li className="pl-6 text-lg font-bold italic opacity-70" key={note}>
              {note}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
