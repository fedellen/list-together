import { useState } from 'react';
import useAddNote from 'src/hooks/mutations/item/useAddNote';
import useKeyPress from 'src/hooks/useKeyPress';
import Button from '../styled/Button';

export default function AddNote() {
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useAddNote();

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(textValue);

  return (
    <div className="single-input">
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter item name"
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
