import useCreateList from 'src/hooks/mutations/list/useCreateList';
import useKeyPress from 'src/hooks/useKeyPress';
import ModalButtons from './ModalButtons';
import { useStateValue } from 'src/state/state';
import { useField } from 'src/hooks/useField';

export default function CreateList() {
  const listInput = useField();
  const [handleAdd, submit] = useCreateList();
  const [, dispatch] = useStateValue();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(listInput.value);

  return (
    <div className="modal-component">
      <input
        {...listInput}
        placeholder="Enter list title"
        autoFocus
        aria-label="Title for New List"
      />
      <ModalButtons
        primaryClick={() => handleAdd(listInput.value)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Create"
      />
    </div>
  );
}
