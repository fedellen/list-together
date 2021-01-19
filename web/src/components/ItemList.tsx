import { List /*, useStyleItemMutation*/ } from 'src/generated/graphql';
import SingleItem from './SingleItem';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  sortedItems: string[];
};

export default function ItemList({ list, sortedItems }: ItemListProps) {
  if (!list.items) {
    return null;
  }
  /** Sort the item data based on User's sorted preferences */
  const orderedItemsToDisplay = list.items.map((itemArray) => itemArray);
  orderedItemsToDisplay.sort((a, b) => {
    return sortedItems.indexOf(a.name) - sortedItems.indexOf(b.name);
  });

  return (
    <>
      <div className="pl-20 pb-4">
        {orderedItemsToDisplay.map((i) => (
          <SingleItem item={i} key={i.name} />
        ))}
      </div>
    </>
  );
}
