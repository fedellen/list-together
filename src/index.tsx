import {
  ApolloClient,
  ApolloProvider,
  // createHttpLink,
  InMemoryCache
} from '@apollo/client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './style/tailwind.css';

// const link = createHttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include'
// });

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  // headers: {
  //   cookie: (typeof window === "undefined"
  //     ? ctx
  //     :
  //   )
  // },
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
