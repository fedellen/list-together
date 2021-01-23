import { Item } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { ItemOptions } from './modals/ItemOptions';
// import { openModal } from 'src/utils/dispatchActions';

type SingleItemProps = {
  item: Item;
};

export default function SingleItem({ item }: SingleItemProps) {
  const [{ activeItem, sideMenuState }, dispatch] = useStateValue();
  const isItemActive = activeItem === item.name;

  const handleItemClick = (itemName: string) => {
    if (isItemActive) {
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: '' });
    } else if (sideMenuState === 'add') {
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: itemName });
    } else if (sideMenuState === 'shop') {
      /** Use strikethrough mutation */
    } else if (sideMenuState === 'sort') {
      /** Handle dragging item */
    }
  };

  return (
    <li>
      <div className="flex flex-wrap items-start ">
        <button
          onClick={() => handleItemClick(item.name)}
          className={`
        text-2xl font-semibold py-1 break-all
        ${item.strike && 'line-through'}
        ${isItemActive && 'underline text-light font-bold'}
        `}
        >
          {item.name}
        </button>
        {isItemActive && <ItemOptions />}
      </div>
      {item.notes && (
        <ul className="list-disc list-inside ">
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
