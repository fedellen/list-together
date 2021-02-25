import { useApolloClient, gql } from '@apollo/client';
import { UserToList } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';

export default function useCurrentSortedItems(): string[] | null {
  const apolloClient = useApolloClient();
  const [{ currentListId }] = useStateValue();

  const userListFrag: UserToList | null = apolloClient.readFragment({
    id: `UserToList:{"listId":"${currentListId}"}`,
    fragment: gql`
      fragment CurrentSortedItems on UserToList {
        sortedItems
      }
    `
  });

  return userListFrag && userListFrag.sortedItems
    ? userListFrag.sortedItems
    : null;
}
