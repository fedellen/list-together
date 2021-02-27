type AutoCompleteItemsProps = {
  filteredWords: string[];
  handleAdd: (text: string) => Promise<void>;
};

export default function AutoCompleteItems({
  filteredWords,
  handleAdd
}: AutoCompleteItemsProps) {
  return (
    <div className="flex flex-wrap gap-2 h-32 overflow-y-scroll items-start  justify-start ">
      {filteredWords.map((word) => (
        <button
          key={word}
          onClick={() => handleAdd(word)}
          className="text-sm bg-gray-200 font-bold p-3 rounded-full shadow-md hover:bg-indigo-300 "
        >
          {word}
        </button>
      ))}
    </div>
  );
}
