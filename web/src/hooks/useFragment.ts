import { useApolloClient, gql } from '@apollo/client';
import { useMemo } from 'react';
import { User, UserToList, List } from 'src/generated/graphql';

type UseFragmentArgs = {
  fragmentField: FragmentFields;
  /** id containts userId | listId | itemId */
  id: string;
};

type UseFragmentPayload = User | UserToList | List | null;

type FragmentFields =
  | ['User', 'sortedListsArray']
  | ['List', 'title']
  | ['List', 'items']
  | ['Item', 'notes']
  | ['UserToList', 'sortedItems']
  | ['UserToList', 'smartSortedItems']
  | ['UserToList', 'mostCommonWords']
  | ['UserToList', 'sharedUsers']
  | ['UserToList', 'privileges'];

/** Get specified `fragmentField`, will only return entity type provided, can be null */
export default function useFragment({
  fragmentField,
  id
}: UseFragmentArgs): UseFragmentPayload {
  const apolloClient = useApolloClient();

  const idField = useMemo(() => {
    if (fragmentField[0] === 'User') {
      return `${fragmentField[0]}:${id}`;
    } else if (fragmentField[0] === 'List') {
      return `${fragmentField[0]}:${id}`;
    } else if (fragmentField[0] === 'UserToList') {
      return `${fragmentField[0]}:{"listId":"${id}"}`;
    } /*if (fragmentField[0] === 'Item')*/ else {
      return `${fragmentField[0]}:${id}`;
    }
  }, [fragmentField]);

  const fragment: UseFragmentPayload = apolloClient.readFragment({
    id: idField,
    fragment: gql`
      fragment ${fragmentField[1]} on ${fragmentField[0]} {
        ${fragmentField[1]}
      }
    `
  });

  return fragment;
}
