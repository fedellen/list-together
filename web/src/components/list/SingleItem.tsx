import { Item, useDeleteNoteMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';
import { ItemOptions } from './ItemOptions';

type SingleItemProps = {
  item: Item;
};

export default function SingleItem({ item }: SingleItemProps) {
  const [{ currentListId, activeItem, activeNote }, dispatch] = useStateValue();
  const [deleteNote, { loading: deleteNoteLoading }] = useDeleteNoteMutation();

  const handleDeleteNote = async (note: string) => {
    if (!deleteNoteLoading) {
      try {
        /** Use `deleteNote` mutation */
        const { data } = await deleteNote({
          variables: {
            data: {
              itemName: item.name,
              listId: currentListId,
              note: note
            }
          }
        });
        if (data?.deleteNote.errors) {
          errorNotifaction(data.deleteNote.errors, dispatch);
        } else {
          dispatch({ type: 'SET_ACTIVE_NOTE', payload: ['', ''] });
        }
      } catch (err) {
        console.error(`Error on Delete Note mutation: ${err}`);
      }
    }
  };

  /** Set to true when user has clicked on an item */
  const isItemActive = activeItem === item.name ? ' active' : '';
  const isStriked = item.strike ? ' strike' : '';
  const hasActiveNote = activeNote[0] === item.name;

  return (
    <li className="item-container">
      <button
        onClick={() =>
          dispatch({ type: 'SET_ACTIVE_ITEM', payload: item.name })
        }
        className={`item-button${isStriked}${isItemActive}`}
      >
        {item.name}
      </button>
      {isItemActive && <ItemOptions />}
      {item.notes && (
        <ul>
          {item.notes.map((note) => (
            <li className="note" key={note}>
              <button
                className={`note-button${isStriked}${
                  hasActiveNote && activeNote[1] === note
                    ? ' hover:text-indigo-700'
                    : ''
                }`}
                onClick={() =>
                  dispatch({
                    type: 'SET_ACTIVE_NOTE',
                    payload: [item.name, note]
                  })
                }
              >
                {note}
              </button>
              {hasActiveNote && activeNote[1] === note && (
                <button
                  className="delete-note"
                  onClick={() => handleDeleteNote(note)}
                >
                  <DeleteIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
