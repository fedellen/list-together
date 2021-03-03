import { useState, useCallback } from 'react';
import { useSortItemsMutation } from 'src/generated/graphql';
import useCurrentSmartSortedItems from 'src/hooks/fragments/useCurrentSmartSortedItems';
import useCurrentSortedItems from 'src/hooks/fragments/useCurrentSortedItems';
import { useStateValue } from 'src/state/state';
import { arrayMove } from 'src/utils/arrayMove';
import delayedFunction from 'src/utils/delayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';

export default function useSortItems() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();
  const currentSmartSortedItems = useCurrentSmartSortedItems();
  const [sortItems] = useSortItemsMutation();
  const sendMutation = useCallback(
    async (
      itemName: string,
      direction: 'sortItemUp' | 'sortItemDown' | 'smartSort'
    ) => {
      if (mutationSubmiting) return;
      /**
       *  Sort Items Mutation
       */

      let newSortedItemsArray: string[];
      if (direction === 'smartSort') {
        newSortedItemsArray = currentSmartSortedItems;
        if (!newSortedItemsArray) {
          sendNotification(dispatch, [
            'Error: Smart sorted items could not be gathered from cache..'
          ]);
          return;
        } else if (
          JSON.stringify(newSortedItemsArray) ===
          JSON.stringify(currentSortedItems)
        ) {
          sendNotification(dispatch, [
            'This list is already in the preferred order..'
          ]);
        }
      } else {
        const currentListIndex = currentSortedItems.indexOf(itemName);
        const delta = direction === 'sortItemUp' ? -1 : 1;

        if (currentListIndex < 1 && delta === -1) {
          // if up clicked and already on top of list
          sendNotification(dispatch, [
            'That item is already at the top of the list..'
          ]);
          return;
        } else if (
          currentListIndex > currentSortedItems.length - 2 &&
          delta === 1
        ) {
          // if down clicked and already on bottom of list
          sendNotification(dispatch, [
            'That item is already at the bottom of the list..'
          ]);
          return;
        } else {
          setMutationSubmiting(true);
          newSortedItemsArray = arrayMove(
            currentSortedItems,
            currentListIndex,
            currentListIndex + delta
          );
        }
      }

      try {
        /** Use `sortItems` mutation */
        const { data } = await sortItems({
          variables: {
            data: {
              stringArray: newSortedItemsArray
            },
            listId: currentListId
          }
        });
        if (data?.sortItems.errors) {
          errorNotifaction(data.sortItems.errors, dispatch);
          delayedFunction(() => setMutationSubmiting(false));
        } else {
          // Delay for only .05 sec on success
          delayedFunction(() => setMutationSubmiting(false), 50);
        }
      } catch (err) {
        console.error(`Error on sortItem mutation: ${err}`);
      }
    },
    [mutationSubmiting, currentSortedItems, currentSmartSortedItems]
  );

  return [sendMutation, mutationSubmiting] as const;
}
