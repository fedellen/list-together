import { List } from 'src/generated/graphql';
import SideMenu from './SideMenu';
import SingleItem from './SingleItem';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  sortedItems: string[];
};

export default function ItemList({ list, sortedItems }: ItemListProps) {
  /** Sort the item data based on User's sorted preferences */
  const orderedItemsToDisplay = list.items?.map((itemArray) => itemArray);
  orderedItemsToDisplay?.sort((a, b) => {
    return sortedItems.indexOf(a.name) - sortedItems.indexOf(b.name);
  });

  return (
    <div className="my-4 pt-4 bg-gray-200 shadow-md flex-col flex rounded-lg">
      <ul className="px-8">
        {list.items && list.items.length > 0 ? (
          orderedItemsToDisplay?.map((i) => (
            <SingleItem item={i} key={i.name} />
          ))
        ) : (
          <div className="italic text-2xl text-center pb-4">
            This list is empty ✍🏾
          </div>
        )}
      </ul>
      <SideMenu />
    </div>
  );
}
