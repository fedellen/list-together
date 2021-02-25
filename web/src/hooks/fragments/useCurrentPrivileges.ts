import { useApolloClient, gql } from '@apollo/client';
import { UserToList } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { UserPrivileges } from 'src/types';

export default function useCurrentPrivileges(): UserPrivileges | null {
  const apolloClient = useApolloClient();
  const [{ currentListId }] = useStateValue();
  const userListFrag: UserToList | null = apolloClient.readFragment({
    id: `UserToList:{"listId":"${currentListId}"}`,
    fragment: gql`
      fragment CurrentPrivileges on UserToList {
        privileges
      }
    `
  });
  /** Postgres only saves as UserPrivileges type */
  return userListFrag ? (userListFrag.privileges as UserPrivileges) : null;
}
