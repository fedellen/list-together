import { Item } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { ItemOptions } from './ItemOptions';

type SingleItemProps = {
  item: Item;
};

export default function SingleItem({ item }: SingleItemProps) {
  const [{ activeItem, sideMenuState }, dispatch] = useStateValue();

  /** Set to true when user has clicked on an item */
  const isItemActive = activeItem === item.name;

  const handleItemClick = (itemName: string) => {
    /** Delay for .001 seconds to await item reset from `App` */
    setTimeout(() => {
      if (isItemActive) {
        dispatch({ type: 'SET_ACTIVE_ITEM', payload: '' });
      } else if (sideMenuState === 'add' || sideMenuState === 'review') {
        dispatch({ type: 'SET_ACTIVE_ITEM', payload: itemName });
      } else if (sideMenuState === 'shop') {
        /** Use strikethrough mutation */
      }
    }, 1);
  };

  return (
    <li className="">
      <div className="my-1 flex">
        <button
          onClick={() => handleItemClick(item.name)}
          className={`
        text-2xl font-semibold  px-2 break-all text-left z-10 
        ${item.strike && 'line-through'}
        ${isItemActive && 'underline text-indigo-700  font-bold'}
        `}
        >
          {item.name}
        </button>
        {isItemActive && <ItemOptions />}
      </div>
      {item.notes && (
        <ul className="">
          {item.notes.map((note) => (
            <li
              className="ml-8  rounded-full text-lg font-bold italic opacity-60  "
              key={note}
            >
              {note}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
