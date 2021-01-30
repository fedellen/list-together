import { List /*, useStyleItemMutation*/ } from 'src/generated/graphql';
import SingleItem from './SingleItem';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  sortedItems: string[] | undefined | null;
};

export default function ItemList({ list, sortedItems }: ItemListProps) {
  if (
    !list.items ||
    !sortedItems ||
    list.items.length === 0 ||
    sortedItems.length === 0
  ) {
    console.log(list.items, sortedItems);
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
    <ul className="container mx-auto pl-12 pr-2 py-4">
      {orderedItemsToDisplay.map((i) => (
        <SingleItem item={i} key={i.name} />
      ))}
    </ul>
  );
}
