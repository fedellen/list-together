import Footer from './Footer';
import Header from './Header';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './modals/ErrorNotification';
import SideMenu from './SideMenu';
import { useStateValue } from 'src/state/state';
import { useEffect } from 'react';
import BodyContent from './BodyContent';
import { resetActiveItem } from 'src/utils/dispatchActions';

export default function App() {
  const [{ appState, activeItem }, dispatch] = useStateValue();
  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
  });

  /** Send to list if user is logged in  */
  useEffect(() => {
    if (data?.getUser && appState !== 'list' && !loading) {
      dispatch({ type: 'SET_APP_STATE', payload: 'list' });
    }
  }, [data]);

  if (loading) {
    return <div>Loading user data...</div>;
  } else if (error && !data) {
    console.error('New error in App.tsx: ', error);
    return <div>Major error in App component: {JSON.stringify(error)}</div>;
  }

  /** Disable side menu when not viewing list/demo */
  let displaySideMenu = false;
  if (appState === 'list' || appState === 'demo') {
    displaySideMenu = true;
  }

  return (
    <div onClick={() => activeItem !== '' && resetActiveItem(dispatch)}>
      {displaySideMenu && <SideMenu />}
      <CurrentModal />
      <ErrorNotification />
      <Header />
      <BodyContent />
      <Footer />
    </div>
  );
}
