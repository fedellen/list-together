import { Footer } from './Footer';
import { Header } from './Header';
import Login from './Login';
import { UsersLists } from './UsersLists';
import { useGetUserQuery } from '../generated/graphql';

export function App() {
  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
    // notifyOnNetworkStatusChange: true
  });

  if (loading) {
    return <div>Loading user data...</div>;
  } else if (error && !data) {
    console.log("we've got a new error: ", error);
    return <div>Major error in App component: {JSON.stringify(error)}</div>;
  }

  return (
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
  );
}
