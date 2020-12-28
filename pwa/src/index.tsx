import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  ApolloLink
  // NormalizedCacheObject
} from '@apollo/client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './style/tailwind.css';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
// import { onError } from '@apollo/client/link/error';

// const errorLink = onError(({ networkError, graphQLErrors }) => {
//   if (networkError || graphQLErrors) {
//     console.error(
//       'Hey, the error link caught a thing: ',
//       networkError || graphQLErrors
//     );
//   }
// });

async function Main() {
  // const [client, setClient] = React.useState<undefined | ApolloClient<NormalizedCacheObject>>(undefined)
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
  });

  const link = ApolloLink.from([httpLink]);

  const cache = new InMemoryCache();

  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage)
  });

  const apolloClient = new ApolloClient({
    cache,
    link
  });

  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>,

    document.getElementById('root')
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA
  serviceWorkerRegistration.register();
  console.log('hey service worker');
}

Main().catch((err) =>
  console.log('big error in Main index: ', JSON.stringify(err))
);
