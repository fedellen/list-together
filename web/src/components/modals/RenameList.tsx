import useRenameList from 'src/hooks/mutations/list/useRenameList';
import { useField } from 'src/hooks/useField';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import CurrentListTitle from '../shared/CurrentListTitle';
import ModalButtons from './ModalButtons';

export default function RenameList() {
  const [, dispatch] = useStateValue();
  const listInput = useField();
  const [handleAdd, submit] = useRenameList();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(listInput.value);

  return (
    <div className="modal-component">
      <CurrentListTitle />
      <input
        {...listInput}
        placeholder="Enter new list title"
        autoFocus
        aria-label="New List Title"
      />
      <ModalButtons
        buttonText="Rename"
        primaryClick={() => handleAdd(listInput.value)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
      />
    </div>
  );
}
