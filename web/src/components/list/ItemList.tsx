import { useMemo } from 'react';
import { List, useSortItemsMutation } from 'src/generated/graphql';
import useCurrentPrivileges from 'src/hooks/fragments/useCurrentPrivileges';
import { useStateValue } from 'src/state/state';
import SideMenu from '../sideMenu/SideMenu';
import SingleItem from './SingleItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { errorNotification } from '../../utils/errorNotification';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  /** Sorted items array for current list */
  sortedItems: string[];
};

export default function ItemList({ list, sortedItems }: ItemListProps) {
  const [{ listState, sideMenuState }, dispatch] = useStateValue();
  const currentPrivileges = useCurrentPrivileges();

  // TODO: Can we memoize `useSensors` to prevent rerendering. Getting useEffect console warnings when using `useSensors` with `useMemo`.
  const options = { activationConstraint: { distance: 0.01 } };
  const pointerSensor = useSensor(PointerSensor, options);
  const mouseSensor = useSensor(MouseSensor, options);
  const touchSensor = useSensor(TouchSensor, options);
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  });

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor
  );

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
  const displayedItemIds = displayItems?.map((i) => i.id) ?? [];

  const [sortItems] = useSortItemsMutation();
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const newIndex = displayedItemIds.indexOf(`${over.id}`);
      const newSortedItems = arrayMove(
        sortedItems,
        displayedItemIds.indexOf(`${active.id}`),
        newIndex
      );
      /** Use `sortItems` mutation */
      sortItems({
        variables: {
          data: {
            stringArray: newSortedItems
          },
          listId: list.id
        }
      }).then(({ data }) => {
        if (data?.sortItems.errors) {
          errorNotification(data.sortItems.errors, dispatch);
        } else {
          dispatch({
            type: 'ADD_TO_UNDO',
            payload: [
              'sortItems',
              { previousItemArray: sortedItems, listId: list.id }
            ]
          });
        }
      });

      // TODO: Use local state to update the list instead of using the server response. This will allow for a smoother UX where we use this instead on drag end
      if (newIndex !== -1) {
        const ul =
          window.document.getElementById('list-container')?.children[0];
        ul?.children[newIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }

  return (
    <div id="list-container">
      {list.items && list.items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayedItemIds ?? []}
            strategy={verticalListSortingStrategy}
          >
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
          </SortableContext>
        </DndContext>
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
