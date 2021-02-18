import { useApolloClient, gql } from '@apollo/client';
import { User } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';

export default function useSortedLists(): string[] | null {
  const apolloClient = useApolloClient();
  const [{ currentUserId }] = useStateValue();

  const userFrag: User | null = apolloClient.readFragment({
    id: `User:${currentUserId}`,
    fragment: gql`
      fragment CurrentListName on List {
        sortedListsArray
      }
    `
  });

  return userFrag && userFrag.sortedListsArray
    ? userFrag.sortedListsArray
    : null;
}
