import { Item } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { ItemOptions } from './ItemOptions';
import Note from './Note';

type SingleItemProps = {
  item: Item;
};

export default function SingleItem({ item }: SingleItemProps) {
  const [{ activeItem }, dispatch] = useStateValue();

  /** activeItem contains item name as string when the user has clicked on an item */
  const isItemActive = activeItem[0] === item.name ? ' active' : '';
  const isStriked = item.strike ? ' strike' : '';

  return (
    <li className="item-container">
      <button
        onClick={() =>
          dispatch({ type: 'SET_ACTIVE_ITEM', payload: [item.name, item.id] })
        }
        className={`item-button${isStriked}${isItemActive}`}
      >
        {item.name}
      </button>
      {isItemActive && <ItemOptions />}
      {item.notes && (
        <ul>
          {item.notes.map((note) => (
            <Note
              item={item.name}
              key={note}
              note={note}
              isStriked={isStriked}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
