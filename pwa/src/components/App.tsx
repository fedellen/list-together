// import { useState } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Login } from './Login';
import { UsersLists } from './UsersLists';
import {
  useGetUserQuery /*useGetUsersListsQuery*/
} from '../generated/graphql';

export function App() {
  // const [user, setUser] = useState('');

  const { data, loading, error } = useGetUserQuery({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });
  // const { refetch } = useGetUsersListsQuery({ skip: true });

  if (loading) {
    return <div>Loading user data...</div>;
  } else if (error) {
    console.log("we've got a new error: ", error);
    // if (user) {
    //   setUser('');
    // }
    return <div>Major Error: {JSON.stringify(error)}</div>;
  }
  // else if (!data?.getUser && user) {
  //   // Invalid user data, null user field
  //   setUser('');
  // } else if (data?.getUser && !user) {
  //   // User is logged in, set user field
  //   refetch(); // Refetch list query during login
  //   setUser(data.getUser.username);
  // }

  return (
    <div className="bg-dark">
      <Header /*user={user}*/ />

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
          <Login /*setUser={setUser}*/ />
        )}
      </div>
      <Footer />
    </div>
  );
}
