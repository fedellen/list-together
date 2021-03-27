import useEditNote from 'src/hooks/mutations/item/useEditNote';
import useKeyPress from 'src/hooks/useKeyPress';
import ModalButtons from './ModalButtons';
import { useStateValue } from 'src/state/state';
import { useField } from 'src/hooks/useField';

export default function EditNote() {
  const newNoteInput = useField();
  const [handleAdd, submit] = useEditNote();
  const [, dispatch] = useStateValue();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(newNoteInput.value);

  return (
    <div className="modal-component">
      <input {...newNoteInput} placeholder="Enter new note" autoFocus />
      <ModalButtons
        primaryClick={() => handleAdd(newNoteInput.value)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Edit"
      />
    </div>
  );
}
