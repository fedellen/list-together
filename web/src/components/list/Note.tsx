import { memo } from 'react';
import { Action } from 'src/state/reducer';
import { NoteState } from 'src/types';
import DeleteNoteButton from './DeleteNoteButton';

type NoteProps = {
  item: string;
  note: string;
  isStriked: string;
  /** Some minor prop drilling to avoid re-rending lots of potential notes 😎 */
  activeNote: NoteState | null;
  dispatch: React.Dispatch<Action>;
  userCanDeleteNotes: boolean;
};

const Note = memo(function Note({
  note,
  isStriked,
  item,
  activeNote,
  dispatch,
  userCanDeleteNotes
}: NoteProps) {
  return (
    <li className="note" key={note}>
      {/** Note with togglable delete button */}
      {userCanDeleteNotes ? (
        <>
          <button
            className={` note-button ${isStriked}${
              activeNote && activeNote.note === note ? ' text-indigo-700' : ''
            }`}
            aria-label="Display Delete Note Button"
            onClick={() =>
              dispatch({
                type: 'SET_ACTIVE_NOTE',
                payload: { item, note }
              })
            }
          >
            {note}
          </button>
          {activeNote && activeNote.note === note && <DeleteNoteButton />}
        </>
      ) : (
        /** Note without togglable delete button */
        <span className={` note-button ${isStriked}`}>{note}</span>
      )}
    </li>
  );
});
export default Note;
