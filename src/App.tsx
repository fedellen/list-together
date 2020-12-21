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

  const { data, loading, error } = useGetUserQuery({});
  const { refetch } = useGetUsersListsQuery({ skip: true });

  // if (user && !listData?.getUsersLists.userToList && !listLoading) {
  //   getLists();
  // }

  if (loading) {
    return <div>Loading user data...</div>;
  } else if (error) {
    console.log("we've got a new error: ", error);
    if (user) {
      setUser('');
    }
    return <div>Major Error: {JSON.stringify(error)}</div>;
  } else if (!data?.getUser && user) {
    // Invalid user data, null user field -- re-render
    setUser('');
  } else if (data?.getUser && !user) {
    // User is logged in, set user field -- re-render
    refetch();
    setUser(data.getUser.username);
  }

  const handleLogout = async () => {
    await logout();
    apolloClient.resetStore();
  };

  return (
    <>
      <Header />
      <div className='bg-blue-600 container mx-auto px-8 py-2'>
        {user ? (
          <>
            <p>Hello {user}!</p>
            {!logoutLoading && (
              <button onClick={() => handleLogout()}>Logout</button>
            )}
            <UsersLists />
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
