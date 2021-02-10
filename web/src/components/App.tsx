import Footer from './Footer';
import Header from './header/Header';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './modals/ErrorNotification';
import { useStateValue } from 'src/state/state';
import { useEffect } from 'react';
import BodyContent from './BodyContent';
import { resetActiveItem } from 'src/utils/dispatchActions';
import LoadingSplash from './styled/LoadingSplash';

export default function App() {
  const [{ appState, activeItem, optionsOpen }, dispatch] = useStateValue();
  const { data, loading: userDataLoading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
  });

  /** Send to list if user is logged in  */
  useEffect(() => {
    if (data?.getUser && appState !== 'list' && !userDataLoading) {
      dispatch({ type: 'SET_APP_STATE', payload: 'list' });
    }
  }, [data]);

  if (error && !data) {
    console.error('New error in App.tsx: ', error);
    return <div>Major error in App component: {JSON.stringify(error)}</div>;
  }

  const handleClick = () => {
    if (activeItem !== '') {
      resetActiveItem(dispatch);
    }
    if (optionsOpen) {
      dispatch({ type: 'TOGGLE_OPTIONS' });
    }
  };

  return (
    <div id="app" onClick={handleClick}>
      <CurrentModal />
      <ErrorNotification />
      <Header />
      {userDataLoading ? <LoadingSplash /> : <BodyContent />}
      <Footer />
    </div>
  );
}
