import {
  HttpLink,
  ApolloLink,
  InMemoryCache,
  ApolloClient
} from '@apollo/client';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

/** Schema constants */
const API_HOST = 'http://localhost:4000/graphql';

export const getApolloClient = async () => {
  const http = new HttpLink({
    uri: API_HOST,
    credentials: 'include'
  });

  const link = ApolloLink.from([http]);

  const cache = new InMemoryCache();

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
