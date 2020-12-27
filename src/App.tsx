import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
// import { Button } from './components/Button';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
// import { ItemList } from './components/ItemList';
import { Login } from './components/Login';
import { UsersLists } from './components/UsersLists';
import {
  // useGetUserLazyQuery,
  useGetUserQuery,
  // useGetUsersListsLazyQuery,
  useGetUsersListsQuery,
  // UserToList,
  useLogoutUserMutation
} from './generated/graphql';
// import Cookies from 'js-cookie';

export function App() {
  const [user, setUser] = useState('');
  const [logout, { loading: logoutLoading }] = useLogoutUserMutation();
  const apolloClient = useApolloClient();

  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network'
  });
  const { refetch } = useGetUsersListsQuery({ skip: true });

  if (loading) {
    return <div>Loading user data...</div>;
  } else if (error) {
    console.log("we've got a new error: ", error);
    if (user) {
      setUser('');
    }
    return <div>Major Error: {JSON.stringify(error)}</div>;
  } else if (!data?.getUser && user) {
    console.log('there is no data');
    // Invalid user data, null user field -- re-render
    setUser('');
  } else if (data?.getUser && !user && !logoutLoading) {
    // User is logged in, set user field -- re-render
    refetch(); // Refetch list query during login
    setUser(data.getUser.username);
  }

  const handleLogout = async () => {
    setUser('');
    await logout();
    apolloClient.clearStore();
  };

  return (
    <>
      <Header user={user} />
      <div className="bg-blue-600 container mx-auto px-10 py-2">
        {user ? (
          <>
            <p>Hello {user}!</p>
            {!logoutLoading && (
              <button onClick={() => handleLogout()}>Logout</button>
            )}
            <UsersLists
              sortedListArray={
                data?.getUser?.sortedListsArray
                  ? data.getUser.sortedListsArray
                  : null
              }
            />
          </>
        ) : (
          <Login setUser={setUser} />
        )}

        {/* {lists && <ItemList list={lists[0].list} />} */}
      </div>
      <Footer />
    </>
  );
}
