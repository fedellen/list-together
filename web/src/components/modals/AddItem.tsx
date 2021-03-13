import { useMemo } from 'react';
import useCurrentMostCommonWords from 'src/hooks/fragments/useCurrentMostCommonWords';
import useAddItem from 'src/hooks/mutations/item/useAddItem';
import useKeyPress from 'src/hooks/useKeyPress';
import AutoCompleteItems from './AutoCompleteItems';
import ModalButtons from './ModalButtons';
import { useStateValue } from 'src/state/state';
import { useField } from 'src/hooks/useField';

export default function AddItem({}) {
  const [, dispatch] = useStateValue();
  const [handleAdd, submit] = useAddItem();

  const itemInput = useField();

  const mostCommonWords = useCurrentMostCommonWords();
  const hasWords = mostCommonWords.length > 0;

  const autoCompleteList = useMemo(
    // Items that match the text value
    () => {
      const filteredWords = mostCommonWords.filter(
        (word) =>
          word.toLowerCase().indexOf(itemInput.value.toLowerCase()) !== -1
      );
      return filteredWords.length > 20
        ? filteredWords.slice(0, 20)
        : filteredWords;
    },
    [itemInput.value]
  );

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(itemInput.value);

  return (
    <div className="modal-component">
      <input {...itemInput} placeholder="Enter item name" autoFocus />
      <ModalButtons
        primaryClick={() => handleAdd(itemInput.value)}
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
