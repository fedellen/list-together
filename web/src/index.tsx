import { ApolloProvider } from '@apollo/client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './style/tailwind.css';
import { getApolloClient } from './utils/getApolloClient';

async function Main() {
  const client = await getApolloClient();

  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,

    document.getElementById('root')
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA
  serviceWorkerRegistration.register();
}

Main().catch((err) =>
  console.log('big error in Main index: ', JSON.stringify(err))
);
