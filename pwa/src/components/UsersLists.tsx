import { useState } from 'react';
import { useGetUsersListsQuery } from '../generated/graphql';
import { ItemList } from './ItemList';
import { SideMenu } from './SideMenu';

type UsersListProps = {
  sortedListArray: string[] | null;
};

export type SideMenuStates = 'shop' | 'add' | 'sort';

export function UsersLists({ sortedListArray }: UsersListProps) {
  // Set current list ID
  const [currentListId, setCurrentListId] = useState(
    sortedListArray ? sortedListArray[0] : ''
  );
  const [sideMenuState, setSideMenuState] = useState<SideMenuStates>('add');

  const { data, loading, error } = useGetUsersListsQuery({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });
  console.log('enter the list');

  if (loading) {
    return <div>Loading lists..</div>;
  } else if (!data && error) {
    return (
      // Fetch error can occur while data exists
      // in the cache during offline mode
      <div>
        There was an error loading your lists:
        {error.message}
      </div>
    );
  } else if (!data || !data.getUsersLists.userToList)
    return <div>Could not find any lists for that user..</div>;

  // Sort the list data based on User's preferences
  // Untested code for now
  const sortedLists = data.getUsersLists.userToList;
  if (sortedListArray) {
    sortedLists.sort((a, b) => {
      if (sortedListArray.includes(a.listId)) return -1;
      if (sortedListArray.includes(b.listId)) return 1;
      else return 0;
    });
  }

  if (currentListId === '') {
    const initialListId = sortedLists.map((list) => list.listId)[0];
    setCurrentListId(initialListId);
  }

  return (
    <>
      <div className="flex flex-row overflow-x-auto">
        {sortedLists.map((userList) => (
          <button
            className="p-6 text-2xl font-semibold border-light border-b-4 mb-6"
            key={userList.listId}
          >
            {userList.list.title}
          </button>
        ))}
      </div>
      {currentListId && (
        <ItemList
          list={
            sortedLists.filter((list) => list.listId === currentListId)[0].list
          }
        />
      )}
      <SideMenu
        state={sideMenuState}
        setState={setSideMenuState}
        currentListId={currentListId}
      />
    </>
  );
}
