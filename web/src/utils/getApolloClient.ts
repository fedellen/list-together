import {
  HttpLink,
  // ApolloLink,
  split,
  InMemoryCache,
  ApolloClient
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

/** Schema constants */
const prod = process.env.NODE_ENV === 'production';
const API_HOST = prod ? '://api.listtogether.app' : '://localhost:4000/graphql';

export const getApolloClient = async () => {
  const http = new HttpLink({
    uri: `http${prod ? 's' : ''}${API_HOST}`,
    credentials: 'include'
  });

  const webSocket = new WebSocketLink({
    uri: `ws${API_HOST}`,
    options: {
      reconnect: true
      // credentials: 'include'
    }
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    webSocket,
    http
  );

  const cache = new InMemoryCache({
    typePolicies: {
      List: {
        fields: {
          items: {
            merge: false
          }
        }
      },
      UserToList: {
        keyFields: ['listId'],
        fields: {
          itemHistory: {
            merge: false
          }
        }
      }
    }
  });

  /** Persist cache to view list during PWA offline mode */
  /** Mutations will not work yet */
  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
    maxSize: false,
    debug: false
  });

  const client = new ApolloClient({
    cache,
    link
  });

  return client;
};
