import Footer from './footer/Footer';
import Header from './header/Header';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './modals/ErrorNotification';
import { useStateValue } from 'src/state/state';
import { useEffect } from 'react';
import BodyContent from './BodyContent';
import LoadingSplash from './shared/LoadingSplash';

export default function App() {
  const [
    { appState, activeItem, activeNote, optionsOpen, modalState, errorMessage },
    dispatch
  ] = useStateValue();
  const { data, loading: userDataLoading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
  });

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

  const handleClick = () => {
    if (activeItem[0] !== '') {
      dispatch({ type: 'CLEAR_STATE' });
    }
    if (optionsOpen) {
      dispatch({ type: 'CLEAR_STATE' });
    }
    if (activeNote[0] !== '') {
      dispatch({ type: 'CLEAR_STATE' });
    }
  };

  return (
    <div id="app">
      {/** clickLayer handles closing menus/modals at zindex: 0 */}
      <div
        id="clickLayer"
        onClick={handleClick}
        className="absolute inset-0 z-0"
      />
      {modalState.active && <CurrentModal />}
      {errorMessage && <ErrorNotification />}
      <Header />
      {userDataLoading && !data ? <LoadingSplash /> : <BodyContent />}
      <Footer />
    </div>
  );
}
