import { useStateValue } from 'src/state/state';
import RenameListIcon from '../svg/headerOptions/RenameListIcon';

export default function EditNoteButton() {
  const [{ listState }, dispatch] = useStateValue();
  if (listState[0] !== 'note') {
    console.error('EditNoteButton opened without note in context');
    return null;
  }

  return (
    <button
      className="delete-note"
      aria-label="Edit Note"
      onClick={() =>
        dispatch({
          type: 'TOGGLE_MODAL',
          payload: {
            active: true,
            type: 'editNote',
            itemName: listState[1].item,
            note: listState[1].note
          }
        })
      }
    >
      <RenameListIcon />
    </button>
  );
}
