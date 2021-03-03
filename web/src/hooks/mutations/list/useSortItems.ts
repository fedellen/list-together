import { useState, useCallback } from 'react';
import { useSortItemsMutation } from 'src/generated/graphql';
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
  const [sortItems] = useSortItemsMutation();
  const sendMutation = useCallback(
    async (itemName: string, direction: 'sortItemUp' | 'sortItemDown') => {
      if (mutationSubmiting) return;
      /**
       *  Sort Items Mutation
       */

      const currentListIndex = currentSortedItems.indexOf(itemName);
      const delta = direction === 'sortItemUp' ? -1 : 1;

      if (currentListIndex < 1 && delta === -1) {
        // if up clicked and already on top of list
        sendNotification(dispatch, [
          'That item is already at the top of the list..'
        ]);
      } else if (
        currentListIndex > currentSortedItems.length - 2 &&
        delta === 1
      ) {
        // if down clicked and already on bottom of list
        sendNotification(dispatch, [
          'That item is already at the bottom of the list..'
        ]);
      } else {
        setMutationSubmiting(true);
        const newSortedItemsArray = arrayMove(
          currentSortedItems,
          currentListIndex,
          currentListIndex + delta
        );

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
      }
    },
    [mutationSubmiting, currentSortedItems]
  );

  return [sendMutation, mutationSubmiting] as const;
}
