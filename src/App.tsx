import { useState } from 'react';
import { ItemList } from './components/ItemList';
import { Login } from './components/Login';
import {
  useGetUserQuery,
  useGetUsersListsQuery,
  UserToList
} from './generated/graphql';

export function App() {
  const [user, setUser] = useState('');
  const [lists, setLists] = useState<null | UserToList[]>(null);
  // const userLists = useGetUserQuery();
  // const apolloClient = useApolloClient();
  const userQuery = useGetUserQuery();
  const listQuery = useGetUsersListsQuery();

  if (userQuery.data && !user) {
    setUser(userQuery.data.getUser.username);
  } else if (user && !userQuery.data) {
    setUser('');
  } else if (listQuery.data) {
    if (listQuery.data.getUsersLists !== lists) {
      setLists(listQuery.data.getUsersLists);
    }
  }

  return (
    <div className='bg-blue-400'>
      {user ? <p>Hello {user}!</p> : <Login />}

      {lists && <ItemList list={lists[0].list} />}
    </div>
  );
}
