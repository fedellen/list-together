import { useMemo, useState } from 'react';
import useCurrentMostCommonWords from 'src/hooks/fragments/useCurrentMostCommonWords';
import useCurrentSortedItems from 'src/hooks/fragments/useCurrentSortedItems';
import useAddItem from 'src/hooks/mutations/useAddItem';
import useKeyPress from 'src/hooks/useKeyPress';
import Button from '../styled/Button';
import AutoCompleteItems from './AutoCompleteItems';

export default function AddItem({}) {
  const [textValue, setTextValue] = useState('');
  const [handleAdd] = useAddItem();

  const currentItemsArray = useCurrentSortedItems();
  const mostCommonWords = useCurrentMostCommonWords();

  const commonWordsWithoutCurrentItems = useMemo(
    // Items not on the list
    () => mostCommonWords?.filter((word) => !currentItemsArray?.includes(word)),
    [mostCommonWords, currentItemsArray]
  );

  const autoCompleteList = useMemo(
    // Items that match the text value
    () =>
      commonWordsWithoutCurrentItems?.filter(
        (word) => word.toLowerCase().indexOf(textValue.toLowerCase()) !== -1
      ),
    [commonWordsWithoutCurrentItems, textValue]
  );

  const displayedWords = useMemo(
    () =>
      autoCompleteList.length > 20
        ? autoCompleteList.slice(0, 20)
        : autoCompleteList,
    [autoCompleteList]
  );

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress) handleAdd(textValue);

  return (
    <div className="single-input">
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder="Enter item name"
        autoFocus
      />
      <Button text="Submit" onClick={() => handleAdd(textValue)} />
      {autoCompleteList.length > 0 && (
        <AutoCompleteItems
          handleAdd={handleAdd}
          filteredWords={displayedWords}
        />
      )}
    </div>
  );
}
