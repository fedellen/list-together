import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  ApolloLink
} from '@apollo/client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './style/tailwind.css';
import { onError } from '@apollo/client/link/error';
// import Cookies from 'js-cookie';

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError || graphQLErrors) {
    console.error(
      'Hey, the error link caught a thing: ',
      networkError || graphQLErrors
    );
    // if (Cookies.get('omr')) {
    // Cookies.remove('omr');
    // console.log('The cookie should be removed..');
    // }
    // window.location.replace('/login')
  }
});

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const link = ApolloLink.from([errorLink, httpLink]);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
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
serviceWorkerRegistration.unregister();
