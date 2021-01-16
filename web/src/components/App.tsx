import Footer from './Footer';
import Header from './Header';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './modals/ErrorNotification';
import SideMenu from './SideMenu';
import { useStateValue } from 'src/state/state';
import { useEffect } from 'react';
import BodyContent from './BodyContent';

export default function App() {
  const [{ appState }, dispatch] = useStateValue();
  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (data?.getUser && appState !== 'list' && !loading) {
      console.log('User found in cache, App State set to `list`');
      dispatch({ type: 'SET_APP_STATE', payload: 'list' });
    }
  }, [data]);

  if (loading) {
    return <div>Loading user data...</div>;
  } else if (error && !data) {
    console.error('New error in App.tsx: ', error);
    return <div>Major error in App component: {JSON.stringify(error)}</div>;
  }

  let displaySideMenu = false;
  if (appState === 'list' || appState === 'demo') {
    displaySideMenu = true;
  }

  return (
    <>
      {displaySideMenu && <SideMenu />}
      <CurrentModal />
      <ErrorNotification />
      <Header />
      <BodyContent />
      <Footer />
    </>
  );
}
