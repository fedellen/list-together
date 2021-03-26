import { memo } from 'react';
import { Action } from 'src/state/reducer';
import { NoteState, UserPrivileges } from 'src/types';
import DeleteNoteButton from './DeleteNoteButton';
import EditNoteButton from './EditNoteButton';

type NoteProps = {
  item: string;
  note: string;
  isStriked: string;
  /** Some minor prop drilling to avoid re-rendering lots of potential notes 😎 */
  activeNote: NoteState | null;
  dispatch: React.Dispatch<Action>;
  listPrivileges: UserPrivileges;
};

const Note = memo(function Note({
  note,
  isStriked,
  item,
  activeNote,
  dispatch,
  listPrivileges
}: NoteProps) {
  const userCanAdd = listPrivileges !== 'read';
  const userCanDelete =
    listPrivileges === 'owner' || listPrivileges === 'delete';

  return (
    <li className="note" key={note}>
      {/** Note with togglable delete button */}
      {userCanAdd ? (
        <>
          <button
            className={` note-button ${isStriked}${
              activeNote && activeNote.note === note ? ' text-indigo-700' : ''
            }`}
            aria-label="Display Note Options"
            onClick={() =>
              dispatch({
                type: 'SET_ACTIVE_NOTE',
                payload: { item, note }
              })
            }
          >
            {note}
          </button>
          {activeNote && activeNote.note === note && (
            <>
              {userCanDelete && <DeleteNoteButton />}
              <EditNoteButton />
            </>
          )}
        </>
      ) : (
        /** Note without togglable delete button */
        <span className={` note-button ${isStriked}`}>{note}</span>
      )}
    </li>
  );
});
export default Note;
