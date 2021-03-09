import { useMemo, useState } from 'react';
import useCurrentMostCommonWords from 'src/hooks/fragments/useCurrentMostCommonWords';
import useAddItem from 'src/hooks/mutations/item/useAddItem';
import useKeyPress from 'src/hooks/useKeyPress';
import AutoCompleteItems from './AutoCompleteItems';
import ModalButtons from './ModalButtons';
import { useStateValue } from 'src/state/state';

export default function AddItem({}) {
  const [, dispatch] = useStateValue();
  const [textValue, setTextValue] = useState('');
  const [handleAdd, submit] = useAddItem();

  const mostCommonWords = useCurrentMostCommonWords();
  const hasWords = mostCommonWords.length > 0;

  const autoCompleteList = useMemo(
    // Items that match the text value
    () => {
      const filteredWords = mostCommonWords.filter(
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
      {hasWords && (
        <div className="auto-complete">
          {autoCompleteList.length > 0 ? (
            <AutoCompleteItems
              handleAdd={handleAdd}
              filteredWords={autoCompleteList}
            />
          ) : (
            <span className="text-5xl font-extrabold">...</span>
          )}
        </div>
      )}
    </div>
  );
}
