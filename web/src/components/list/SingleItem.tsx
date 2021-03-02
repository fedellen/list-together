import { memo } from 'react';
import { Item } from 'src/generated/graphql';
import { Action } from 'src/state/reducer';
import { NoteState } from 'src/types';
import { ItemOptions } from './ItemOptions';
import Note from './Note';

type SingleItemProps = {
  item: Item;
  activeItem: string;
  activeNote: NoteState | null;
  dispatch: React.Dispatch<Action>;
  userCanDeleteNotes: boolean;
};

const SingleItem = memo(function SingleItem({
  item,
  activeItem,
  activeNote,
  dispatch,
  userCanDeleteNotes
}: SingleItemProps) {
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
              activeNote={activeNote}
              userCanDeleteNotes={userCanDeleteNotes}
              dispatch={dispatch}
              isStriked={isStriked}
            />
          ))}
        </ul>
      )}
    </li>
  );
});
export default SingleItem;
