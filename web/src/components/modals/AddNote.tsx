import useAddNote from 'src/hooks/mutations/item/useAddNote';
import { useField } from 'src/hooks/useField';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import ModalButtons from './ModalButtons';

export default function AddNote() {
  const noteInput = useField();
  const [handleAdd, submit] = useAddNote();
  const [, dispatch] = useStateValue();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(noteInput.value);

  return (
    <div className="modal-component">
      <input
        {...noteInput}
        placeholder="Enter note"
        autoFocus
        aria-label="Text for Note"
      />
      <ModalButtons
        primaryClick={() => handleAdd(noteInput.value)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Add"
      />
    </div>
  );
}
