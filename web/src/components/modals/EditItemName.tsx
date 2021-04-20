import useEditItemName from 'src/hooks/mutations/item/useEditItemName';
import useKeyPress from 'src/hooks/useKeyPress';
import ModalButtons from './ModalButtons';
import { useStateValue } from 'src/state/state';
import { useField } from 'src/hooks/useField';

export default function EditItemName() {
  const [{ listState }, dispatch] = useStateValue();
  if (listState[0] !== 'modal') return null;

  const newItemNameInput = useField(
    listState[1].itemName ? listState[1].itemName : ''
  );
  const [handleAdd, submit] = useEditItemName();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(newItemNameInput.value);

  return (
    <div className="modal-component">
      <input
        {...newItemNameInput}
        placeholder="Enter new item name"
        autoFocus
        aria-label="New item name"
      />
      <ModalButtons
        primaryClick={() => handleAdd(newItemNameInput.value)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Edit"
      />
    </div>
  );
}
