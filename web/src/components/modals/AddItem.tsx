import { useMemo, useState } from 'react';
import useCurrentMostCommonWords from 'src/hooks/fragments/useCurrentMostCommonWords';
import useAddItem from 'src/hooks/mutations/item/useAddItem';
import useKeyPress from 'src/hooks/useKeyPress';
import Button from '../styled/Button';
import AutoCompleteItems from './AutoCompleteItems';

export default function AddItem({}) {
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useAddItem();

  const mostCommonWords = useCurrentMostCommonWords();

  const autoCompleteList = useMemo(
    // Items that match the text value
    () => {
      const filteredWords = mostCommonWords?.filter(
        (word) => word.toLowerCase().indexOf(textValue.toLowerCase()) !== -1
      );
      return filteredWords.length > 20
        ? filteredWords.slice(0, 20)
        : filteredWords;
    },
    [textValue]
  );

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
      {autoCompleteList.length > 0 && (
        <AutoCompleteItems
          handleAdd={handleAdd}
          filteredWords={autoCompleteList}
        />
      )}
    </div>
  );
}
