import { List } from 'src/generated/graphql';
import SingleItem from './SingleItem';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  sortedItems: string[];
};

export default function ItemList({ list, sortedItems }: ItemListProps) {
  if (!list.items || list.items.length === 0) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="text-xl italic">This list is empty ✍🏾</div>
      </div>
    );
  }
  /** Sort the item data based on User's sorted preferences */
  const orderedItemsToDisplay = list.items.map((itemArray) => itemArray);
  orderedItemsToDisplay.sort((a, b) => {
    return sortedItems.indexOf(a.name) - sortedItems.indexOf(b.name);
  });

  return (
    // <div className="container mx-auto">
    <ul className="my-4 rounded-md pl-12 pr-2 py-4 bg-gray-200 shadow-md">
      {orderedItemsToDisplay.map((i) => (
        <SingleItem item={i} key={i.name} />
      ))}
    </ul>
  );
}
