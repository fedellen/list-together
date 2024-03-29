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
  const [mutationSubmitting, setMutationSubmitting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const currentSortedItems = useCurrentSortedItems();
  const currentSmartSortedItems = useCurrentSmartSortedItems();
  const [sortItems] = useSortItemsMutation();
  const mutationCooldown = useDelayedFunction(() => {
    setMutationSubmitting(false);
  });
  const sendMutation = useCallback(
    async (
      itemName: string,
      direction: 'sortItemUp' | 'sortItemDown' | 'smartSort'
    ) => {
      if (mutationSubmitting) return;
      /**
       *  Sort Items Mutation
       */

      const previousSortedItems = currentSortedItems;
      let newSortedItemsArray: string[];
      let newIndex = -1;
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
          newIndex = currentListIndex + delta;
        }
      }

      try {
        setMutationSubmitting(true);
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
          if (newIndex !== -1) {
            const ul =
              window.document.getElementById('list-container')?.children[0];
            ul?.children[newIndex].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
          // Delay for only .05 sec on success
          mutationCooldown(50);
        }
      } catch (err) {
        sendNotification(dispatch, [
          'Connection to the server could not be established. Interacting with the list will not function offline.'
        ]);
        dispatch({ type: 'CLEAR_STATE' });
      }
    },
    [mutationSubmitting, currentSortedItems, currentSmartSortedItems]
  );

  return [sendMutation, mutationSubmitting] as const;
}
