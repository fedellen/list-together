import { useContext } from 'react';
import { List } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import SideMenu from './SideMenu';
import SingleItem from './SingleItem';
import { ListContext } from './UsersLists';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  // sortedItems: string[];
};

export default function ItemList({ list }: ItemListProps) {
  const [{ sideMenuState }, dispatch] = useStateValue();
  const listContext = useContext(ListContext);
  if (!listContext) {
    sendNotification(dispatch, [
      '`ItemList` has been opened without ListContext..'
    ]);
    return null;
  }
  const sortedItems = listContext.sortedItems;

  /** Sort the current item data based on User's sorted preferences */
  const orderedItems = list.items?.map((itemArray) => itemArray);
  orderedItems?.sort((a, b) => {
    return sortedItems.indexOf(a.name) - sortedItems.indexOf(b.name);
  });
  const strikedItems = orderedItems?.filter((item) => item.strike === true);

  /** Display only striked items in `review` mode, else display all items */
  const displayItems = sideMenuState === 'review' ? strikedItems : orderedItems;

  return (
    <div id="list-container">
      {list.items && list.items.length > 0 ? (
        <ul>
          {displayItems?.map((i) => (
            <SingleItem item={i} key={i.name} />
          ))}
        </ul>
      ) : (
        <span>This list is empty ✍🏾</span>
      )}
      <SideMenu />
    </div>
  );
}
