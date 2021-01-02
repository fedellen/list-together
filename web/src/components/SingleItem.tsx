import { Item } from 'src/generated/graphql';

type SingleItemProps = {
  item: Item;
  /** Function to use on click, uses Item's name */
  handleItemClick: (arg: string) => void;
};

export default function SingleItem({ item, handleItemClick }: SingleItemProps) {
  return (
    <div>
      <button
        onClick={() => handleItemClick(item.name)}
        className="bg-red-400 text-2xl font-bold py-1"
      >
        {item.name}
      </button>
    </div>
  );
}
