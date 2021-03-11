import Footer from './footer/Footer';
import Header from './header/Header';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './modals/ErrorNotification';
import { useStateValue } from 'src/state/state';
import { useEffect } from 'react';
import LoadingSplash from './shared/LoadingSplash';
import UsersLists from './list/UsersLists';
import HomePage from './HomePage';

export default function App() {
  const [{ appState, listState, errorMessage }, dispatch] = useStateValue();
  const { data, loading: userDataLoading, error, refetch } = useGetUserQuery();

  /** Get user on mount */
  useEffect(() => {
    refetch();
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
    console.error('New error in App.tsx: ', error);
    return <div>Major error in App component: {JSON.stringify(error)}</div>;
  }

  return (
    <div id="app">
      {/** clickLayer handles closing menus/modals at zindex: 0 */}
      {listState[0] !== 'side' && (
        <div
          id="clickLayer"
          onClick={() => dispatch({ type: 'CLEAR_STATE' })}
        />
      )}
      {listState[0] === 'modal' && <CurrentModal />}
      {errorMessage && <ErrorNotification />}
      <Header />
      {userDataLoading && !data ? (
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
