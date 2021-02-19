import { useApolloClient, gql } from '@apollo/client';
import { UserToList } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';

export default function useCurrentMostCommonWords(): string[] | null {
  const apolloClient = useApolloClient();
  const [{ currentListId }] = useStateValue();

  const userListFrag: UserToList | null = apolloClient.readFragment({
    id: `UserToList:{"listId":"${currentListId}"}`,
    fragment: gql`
      fragment CurrentMostCommonWords on UserToList {
        mostCommonWords
      }
    `
  });

  return userListFrag && userListFrag.mostCommonWords
    ? userListFrag.mostCommonWords
    : null;
}
