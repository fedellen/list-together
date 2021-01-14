import Footer from './Footer';
import Header from './Header';
import Login from './Login';
import UsersLists from './UsersLists';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './ErrorNotification';
import SideMenu from './SideMenu';
import { useStateValue } from 'src/state/state';
import { useEffect } from 'react';

export default function App() {
  const [{ appState }, dispatch] = useStateValue();
  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    console.log('Use effect for App State was triggered');
    if (data?.getUser && appState !== 'list') {
      dispatch({ type: 'SET_APP_STATE', payload: 'list' });
    }
  }, [appState]);

  if (loading) {
    return <div>Loading user data...</div>;
  } else if (error && !data) {
    console.error('New error in App.tsx: ', error);
    return <div>Major error in App component: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="">
      <CurrentModal />
      <ErrorNotification />

      <SideMenu />

      <div className="bg-dark">
        <Header />

        {data?.getUser ? (
          <UsersLists
            sortedListArray={
              data?.getUser?.sortedListsArray
                ? data.getUser.sortedListsArray
                : null
            }
          />
        ) : (
          <Login />
        )}
        <Footer />
      </div>
    </div>
  );
}
