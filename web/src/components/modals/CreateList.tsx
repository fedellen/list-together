import { useState } from 'react';
import useCreateList from 'src/hooks/mutations/list/useCreateList';
import useKeyPress from 'src/hooks/useKeyPress';
import ModalButtons from './ModalButtons';
import { useStateValue } from 'src/state/state';

export default function CreateList() {
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useCreateList();
  const [, dispatch] = useStateValue();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(textValue);

  return (
    <div className="modal-component">
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter list title"
        autoFocus
      />
      <ModalButtons
        primaryClick={() => handleAdd(textValue)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Create"
      />
    </div>
  );
}
