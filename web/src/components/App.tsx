import Footer from './Footer';
import Header from './Header';
import Login from './Login';
import UsersLists from './UsersLists';
import { useGetUserQuery } from '../generated/graphql';
import CurrentModal from './modals/CurrentModal';
import ErrorNotification from './ErrorNotification';

export default function App() {
  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
  });

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
      <div className="bg-dark">
        <Header />

        <div className="container mx-auto px-10 pb-8">
          {data?.getUser ? (
            <>
              <UsersLists
                sortedListArray={
                  data?.getUser?.sortedListsArray
                    ? data.getUser.sortedListsArray
                    : null
                }
              />
            </>
          ) : (
            <Login />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
