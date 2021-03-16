import Footer from './footer/Footer';
import Header from './header/Header';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './modals/ErrorNotification';
import { useStateValue } from 'src/state/state';
import { useEffect, useState } from 'react';
import LoadingSplash from './shared/LoadingSplash';
import UsersLists from './list/UsersLists';
import HomePage from './HomePage';

export default function App() {
  const [{ appState, listState, errorMessage }, dispatch] = useStateValue();
  const { data, loading: userDataLoading, error, refetch } = useGetUserQuery();

  const [initialLoad, setInitialLoad] = useState(true);

  /** Get user on mount */
  useEffect(() => {
    refetch();
    setTimeout(() => {
      /** Always show LoadingSplash for first 0.75 seconds */
      setInitialLoad(false);
    }, 750);
  }, []);

  /** Send to list if user is logged in  */
  useEffect(() => {
    if (data?.getUser && appState !== 'list' && !userDataLoading) {
      dispatch({
        type: 'SET_USER',
        payload: data.getUser.id
      });
    }
  }, [data]);

  if (error && !data) {
    console.error('Major error in App.tsx: ', error);
    return (
      <div className="mx-auto py-8 text-lg">
        Server seems to unreachable at this time:{' '}
        <code>{JSON.stringify(error, null, 4)}</code>
      </div>
    );
  }

  return (
    <div id="app">
      {/** clickLayer handles closing menus/modals at z-index: 0 */}
      {listState[0] !== 'side' && (
        <div
          id="clickLayer"
          onClick={() => dispatch({ type: 'CLEAR_STATE' })}
        />
      )}
      {listState[0] === 'modal' && <CurrentModal />}
      {errorMessage && <ErrorNotification />}
      <Header />
      {(userDataLoading && !data) || initialLoad ? (
        <LoadingSplash />
      ) : appState === 'list' ? (
        /** User is logged in: */
        <UsersLists
          sortedListsArray={
            data?.getUser?.sortedListsArray ? data.getUser.sortedListsArray : []
          }
        />
      ) : (
        /** User is logged out: */
        <HomePage />
      )}
      <Footer />
    </div>
  );
}
