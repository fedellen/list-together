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
        <button
          key={word}
          onClick={() => handleAdd(word)}
          className=" bg-gray-200 font-bold p-2 px-4 rounded-full shadow-md hover:bg-indigo-300"
        >
          {word}
        </button>
      ))}
    </div>
  );
}
