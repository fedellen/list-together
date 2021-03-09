import { useState } from 'react';
import useRenameList from 'src/hooks/mutations/list/useRenameList';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import CurrentListTitle from '../shared/CurrentListTitle';
import ModalButtons from './ModalButtons';

export default function RenameList() {
  const [, dispatch] = useStateValue();
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useRenameList();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(textValue);

  return (
    <div className="modal-component">
      <CurrentListTitle />
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter new list title"
        autoFocus
      />
      <ModalButtons
        buttonText="Rename"
        primaryClick={() => handleAdd(textValue)}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
      />
    </div>
  );
}
