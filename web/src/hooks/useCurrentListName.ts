import { useApolloClient, gql } from '@apollo/client';
import { List } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';

export default function useCurrentListName(): string | null {
  const apolloClient = useApolloClient();
  const [{ currentListId }] = useStateValue();

  const listFrag: List | null = apolloClient.readFragment({
    id: `List:${currentListId}`,
    fragment: gql`
      fragment CurrentListName on List {
        title
      }
    `
  });

  return listFrag ? listFrag.title : null;
}
