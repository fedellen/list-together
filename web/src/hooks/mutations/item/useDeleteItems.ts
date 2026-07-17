import { useState, useCallback } from 'react';
import { useDeleteItemsMutation } from 'src/generated/graphql';
import { useApolloClient } from '@apollo/client';
import type { ApolloClient } from '@apollo/client';
import { useStateValue } from 'src/state/state';
import { errorNotification } from 'src/utils/errorNotification';
import useDelayedFunction from 'src/hooks/useDelayedFunction';
import { sendNotification } from 'src/utils/dispatchActions';
import {
  applyOptimisticDeleteItems,
  rollbackListCache,
  snapshotListCache
} from 'src/utils/optimisticListCache';

export default function useDeleteItems() {
  const [mutationSubmiting, setMutationSubmiting] = useState(false);
  const [{ currentListId }, dispatch] = useStateValue();
  const apolloClient = useApolloClient() as ApolloClient<
    Record<string, unknown>
  >;
  const [deleteItems] = useDeleteItemsMutation();
  const mutationCooldown = useDelayedFunction(() =>
    setMutationSubmiting(false)
  );

  const sendMutation = useCallback(
    async (itemNames: string[]) => {
      if (mutationSubmiting) return;
      /**
       *  Delete Items Mutation
       */
      const cacheSnapshot = snapshotListCache(apolloClient, currentListId);
      applyOptimisticDeleteItems(apolloClient, currentListId, itemNames);

      setMutationSubmiting(true);
      try {
        const { data } = await deleteItems({
          variables: {
            data: {
              itemNameArray: itemNames,
              listId: currentListId
            }
          }
        });
        if (data?.deleteItems.errors) {
          errorNotification(data.deleteItems.errors, dispatch);
          mutationCooldown();
        } else {
          dispatch({
            type: 'ADD_TO_UNDO',
            payload: [
              'deleteItems',
              {
                itemNameArray: itemNames,
                listId: currentListId
              }
            ]
          });
          mutationCooldown();
          dispatch({ type: 'SET_SIDE_MENU_STATE', payload: 'add' });
          dispatch({ type: 'CLEAR_STATE' });
        }
      } catch (err) {
        rollbackListCache(apolloClient, cacheSnapshot);
        sendNotification(dispatch, [
          'Connection to the server could not be established. Interacting with the list will not function offline.'
        ]);
        dispatch({ type: 'CLEAR_STATE' });
      }
    },
    [
      apolloClient,
      currentListId,
      deleteItems,
      dispatch,
      mutationCooldown,
      mutationSubmiting
    ]
  );

  return [sendMutation, mutationSubmiting] as const;
}
