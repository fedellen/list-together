import { useState } from 'react';
import useRenameList from 'src/hooks/mutations/list/useRenameList';
import useKeyPress from 'src/hooks/useKeyPress';
import Button from '../styled/Button';

export default function RenameList() {
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useRenameList();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(textValue);

  return (
    <div className="single-input">
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter new list title"
        autoFocus
      />
      <Button
        text="Submit"
        onClick={() => handleAdd(textValue)}
        isLoading={submit}
      />
    </div>
  );
}
