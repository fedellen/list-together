type AutoCompleteItemsProps = {
  filteredWords: string[];
  handleAdd: (text: string) => Promise<void>;
};

export default function AutoCompleteItems({
  filteredWords,
  handleAdd
}: AutoCompleteItemsProps) {
  return (
    <div className="auto-complete-items">
      {filteredWords.map((word) => (
        <button key={word} onClick={() => handleAdd(word)}>
          {word}
        </button>
      ))}
    </div>
  );
}
