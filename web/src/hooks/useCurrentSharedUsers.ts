import { useApolloClient, gql } from '@apollo/client';
import { SharedUsers, UserToList } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';

export default function useCurrentSharedUsers(): SharedUsers[] | null {
  const apolloClient = useApolloClient();
  const [{ currentListId }] = useStateValue();

  const userListFrag: UserToList | null = apolloClient.readFragment({
    id: `UserToList:{"listId":"${currentListId}"}`,
    fragment: gql`
      fragment CurrentSharedUsers on UserToList {
        title
      }
    `
  });

  return userListFrag ? userListFrag.sharedUsers : null;
}
