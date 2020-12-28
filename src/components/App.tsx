import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
// import { Button } from './components/Button';
import { Footer } from './Footer';
import { Header } from './Header';
// import { ItemList } from './components/ItemList';
import { Login } from './Login';
import { UsersLists } from './UsersLists';
import {
  // useGetUserLazyQuery,
  useGetUserQuery,
  // useGetUsersListsLazyQuery,
  useGetUsersListsQuery,
  // UserToList,
  useLogoutUserMutation
} from '../generated/graphql';
import { Menu } from './Menu';
// import Cookies from 'js-cookie';

export function App() {
  const [user, setUser] = useState('');
  const [showMenu, setShowMenu] = useState(false);
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

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="">
      <Header user={user} handleShowMenu={handleShowMenu} />
      {showMenu && (
        <Menu handleShowMenu={handleShowMenu} handleLogout={handleLogout} />
      )}
      <div className="container mx-auto px-10 py-2">
        {user ? (
          <>
            {/* <p>Hello {user}!</p>
            {!logoutLoading && (
              <button onClick={() => handleLogout()}>Logout</button>
            )} */}
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
    </div>
  );
}
