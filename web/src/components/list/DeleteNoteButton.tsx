import useDeleteNote from 'src/hooks/mutations/item/useDeleteNote';
import DeleteIcon from '../svg/itemOptions/DeleteIcon';

export default function DeleteNoteButton() {
  const [deleteNote, submit] = useDeleteNote();
  return (
    <button
      className="delete-note"
      onClick={submit ? undefined : () => deleteNote()}
    >
      <DeleteIcon />
    </button>
  );
}
