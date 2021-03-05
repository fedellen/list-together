import { useState, useCallback } from 'react';
import { useSortItemsMutation } from 'src/generated/graphql';
import useCurrentSmartSortedItems from 'src/hooks/fragments/useCurrentSmartSortedItems';
import useCurrentSortedItems from 'src/hooks/fragments/useCurrentSortedItems';
import { useStateValue } from 'src/state/state';
import { arrayMove } from 'src/utils/arrayMove';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

export default function useSortItems() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();
  const currentSmartSortedItems = useCurrentSmartSortedItems();
  const [sortItems] = useSortItemsMutation();
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmiting(false);
  });
  const sendMutation = useCallback(
    async (
      itemName: string,
      direction: 'sortItemUp' | 'sortItemDown' | 'smartSort'
    ) => {
      if (mutationSubmiting) return;
      /**
       *  Sort Items Mutation
       */

      const previousSortedItems = currentSortedItems;
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
          newSortedItemsArray = arrayMove(
            currentSortedItems,
            currentListIndex,
            currentListIndex + delta
          );
        }
      }

      try {
        setMutationSubmiting(true);
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
          errorNotification(data.sortItems.errors, dispatch);
          mutationCooldown();
        } else {
          dispatch({
            type: 'ADD_TO_UNDO',
            payload: [
              'sortItems',
              { previousItemArray: previousSortedItems, listId: currentListId }
            ]
          });
          // Delay for only .05 sec on success
          mutationCooldown(50);
        }
      } catch (err) {
        console.error(`Error on sortItem mutation: ${err}`);
      }
    },
    [mutationSubmiting, currentSortedItems, currentSmartSortedItems]
  );

  return [sendMutation, mutationSubmiting] as const;
}
