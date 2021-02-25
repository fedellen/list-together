import { useApolloClient, gql } from '@apollo/client';
import { User, UserToList, List } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';

type UseFragmentArgs = {
  fragmentField: FragmentFields;
};

type UseFragmentPayload = User | UserToList | List | null;

type FragmentFields =
  | ['User', 'sortedLists']
  | ['List', 'title']
  | ['UserToList', 'sortedItems']
  | ['UserToList', 'mostCommonWords']
  | ['UserToList', 'sharedUsers']
  | ['UserToList', 'privileges'];

/** Get specified `fragmentField`, will only return entity type provided, can be null */
export default function useFragment({
  fragmentField
}: UseFragmentArgs): UseFragmentPayload {
  const apolloClient = useApolloClient();
  const [{ currentUserId, currentListId }] = useStateValue();

  const fragment: UseFragmentPayload = apolloClient.readFragment({
    id: `${fragmentField[0]}:${
      fragmentField[0] === 'User' ? currentUserId : currentListId
    }`,
    fragment: gql`
      fragment ${fragmentField[1]} on ${fragmentField[0]} {
        ${fragmentField[1]}
      }
    `
  });

  return fragment;
}
