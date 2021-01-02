import { useState } from 'react';
import { SideMenuState, UserPrivileges } from '../types';
import { useGetUsersListsQuery } from '../generated/graphql';
import ItemList from './ItemList';
import SideMenu from './SideMenu';

type UsersListProps = {
  /** Sorted array to display lists in the user's preferred order */
  sortedListArray: string[] | null;
};

export default function UsersLists({ sortedListArray }: UsersListProps) {
  /** Set the current list ID */
  const [currentListId, setCurrentListId] = useState(
    sortedListArray ? sortedListArray[0] : ''
  );

  /** Side menu states determine what happens when clicking on items */
  const [sideMenuState, setSideMenuState] = useState<SideMenuState>('add');

  const { data, loading, error } = useGetUsersListsQuery({});

  if (loading) {
    return <div>Loading lists..</div>;
  } else if (!data && error) {
    /** Fetch error can occur while data exists during offline mode */
    return (
      <div>
        There was an error loading your lists:
        {error.message}
      </div>
    );
  } else if (!data || !data.getUsersLists.userToList)
    return <div>Could not find any lists for that user..</div>;

  /** Sort the list data based on User's preferences */
  const sortedLists = data.getUsersLists.userToList;
  if (sortedListArray) {
    /** This code is untested for now */
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

  const currentList = sortedLists.find((list) => list.listId === currentListId);

  return (
    <>
      <div className="flex flex-row overflow-x-auto">
        {sortedLists.map((userList) => (
          <button
            className="p-6 text-2xl font-semibold border-light border-b-4 mb-6"
            key={userList.listId}
            onClick={() => setCurrentListId(userList.listId)}
          >
            {userList.list.title}
          </button>
        ))}
      </div>
      {currentList && (
        <ItemList
          list={currentList.list}
          sideMenuState={sideMenuState}
          userPrivileges={currentList.privileges as UserPrivileges[]} // Database only stores `privilege` types
        />
      )}
      <SideMenu
        sideMenuState={sideMenuState}
        setSideMenuState={setSideMenuState}
        currentListId={currentListId}
      />
    </>
  );
}
