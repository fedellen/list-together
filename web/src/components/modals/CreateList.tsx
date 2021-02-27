import { useState } from 'react';
import useCreateList from 'src/hooks/mutations/list/useCreateList';
import useKeyPress from 'src/hooks/useKeyPress';
import Button from '../styled/Button';

export default function CreateList() {
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useCreateList();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(textValue);

  return (
    <div className="single-input">
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter list title"
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
