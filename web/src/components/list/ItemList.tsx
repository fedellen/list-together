import { useMemo } from 'react';
import { List } from 'src/generated/graphql';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import { useStateValue } from 'src/state/state';
import SideMenu from '../sideMenu/SideMenu';
import SingleItem from './SingleItem';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  /** Sorted items array for current list */
  sortedItems: string[];
};

export default function ItemList({ list, sortedItems }: ItemListProps) {
  const [{ listState, sideMenuState }, dispatch] = useStateValue();
  const currentPrivileges = useCurrentPrivileges();

  const orderedItems = useMemo(
    () =>
      list.items
        ?.map((itemArray) => itemArray)
        .sort(
          (a, b) => sortedItems.indexOf(a.name) - sortedItems.indexOf(b.name)
        ),

    [list, sortedItems]
  );

  const strikedItems = useMemo(
    () => orderedItems?.filter((item) => item.strike === true),
    [orderedItems]
  );

  /** Display only striked items in `review` mode, else display all items */
  const displayItems = sideMenuState === 'review' ? strikedItems : orderedItems;

  return (
    <div id="list-container">
      {list.items && list.items.length > 0 ? (
        <ul>
          {displayItems?.map((i) => (
            <SingleItem
              item={i}
              activeItem={listState[0] === 'item' ? listState[1].name : ''}
              activeNote={listState[0] === 'note' ? listState[1] : null}
              listPrivileges={currentPrivileges}
              dispatch={dispatch}
              key={i.name}
            />
          ))}
        </ul>
      ) : (
        <span>This list is empty ✍🏾</span>
      )}
      {listState[0] === 'side' ? (
        <SideMenu
          strikedItems={strikedItems ? strikedItems.map((i) => i.name) : []}
        />
      ) : (
        /** Render div with same height for smoother UX */
        <div className="h-32 xl:h-36" />
      )}
    </div>
  );
}
