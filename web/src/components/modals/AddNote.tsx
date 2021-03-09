import { useState } from 'react';
import useAddNote from 'src/hooks/mutations/item/useAddNote';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import ModalButtons from './ModalButtons';

export default function AddNote() {
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useAddNote();
  const [, dispatch] = useStateValue();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(textValue);

  return (
    <div className="modal-component">
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter item name"
        autoFocus
      />
      <ModalButtons
        primaryClick={() => handleAdd(textValue)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Add"
      />
    </div>
  );
}
