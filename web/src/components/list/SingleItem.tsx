import { memo } from 'react';
import { Item } from 'src/generated/graphql';
import { Action } from 'src/state/reducer';
import { useStateValue } from 'src/state/state';
import { ItemOptions } from './ItemOptions';
import Note from './Note';

type SingleItemProps = {
  item: Item;
  activeItem: string;
  dispatch: React.Dispatch<Action>;
};

const SingleItem = memo(function SingleItem({
  item,
  activeItem
}: SingleItemProps) {
  const [, dispatch] = useStateValue();

  /** listState[1] contains item name as string when activeItem is true */
  const isItemActive = activeItem === item.name ? ' active' : '';
  const isStriked = item.strike ? ' strike' : '';

  return (
    <li className="item-container">
      <button
        onClick={() =>
          dispatch({
            type: 'SET_ACTIVE_ITEM',
            payload: { name: item.name, id: item.id }
          })
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
});
export default SingleItem;
