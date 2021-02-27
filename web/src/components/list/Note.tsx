import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import { useStateValue } from 'src/state/state';
import DeleteNoteButton from './DeleteNoteButton';

type NoteProps = {
  item: string;
  note: string;
  /** To contain " strike" when `true` */
  isStriked: string;
};

export default function Note({ note, isStriked, item }: NoteProps) {
  const [{ activeNote }, dispatch] = useStateValue();

  const currentPrivileges = useCurrentPrivileges();
  const userCanDeleteNotes: boolean =
    currentPrivileges === 'owner' || currentPrivileges === 'delete';

  return (
    <li className="note" key={note}>
      {/** Note with togglable delete button */}
      {userCanDeleteNotes ? (
        <>
          <button
            className={`note-button${isStriked}${
              activeNote[1] === note ? ' text-indigo-700' : ''
            }`}
            onClick={() =>
              dispatch({
                type: 'SET_ACTIVE_NOTE',
                payload: [item, note]
              })
            }
          >
            {note}
          </button>
          {activeNote[1] === note && <DeleteNoteButton />}
        </>
      ) : (
        /** Note without togglable delete button */
        <span className={`note-button${isStriked}`}>{note}</span>
      )}
    </li>
  );
}
