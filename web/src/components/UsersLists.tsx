// import { useState } from 'react';
// import { SideMenuState, UserPrivileges } from '../types';
import { useGetUsersListsQuery } from '../generated/graphql';
import ItemList from './ItemList';
import SideMenu from './SideMenu';
import { useStateValue } from 'src/state/state';
import { UserPrivileges } from 'src/types';
import { useEffect } from 'react';

type UsersListProps = {
  /** Sorted array to display lists in the user's preferred order */
  sortedListArray: string[] | null;
};

export default function UsersLists({ sortedListArray }: UsersListProps) {
  /** Set the current list ID */
  // const [currentListId, setCurrentListId] = useState(
  //   sortedListArray ? sortedListArray[0] : ''
  // );

  const [{ currentListId }, dispatch] = useStateValue();

  useEffect(() => {
    console.log('Call initialize list');
    if (currentListId === '') {
      const initialListId = sortedLists[0].listId;
      const initialPrivileges = sortedLists[0].privileges as UserPrivileges[];
      /** Database only stores `UserPrivileges` type */
      dispatch({
        type: 'SET_LIST',
        payload: { listId: initialListId, privileges: initialPrivileges }
      });
    }
  }, []);

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

  const currentList = sortedLists.find((list) => list.listId === currentListId);

  return (
    <>
      <div className="flex flex-row overflow-x-auto">
        {sortedLists.map((userList) => (
          <button
            className="p-6 text-2xl font-semibold border-light border-b-4 mb-6"
            key={userList.listId}
            onClick={() =>
              dispatch({
                type: 'SET_LIST',
                payload: {
                  listId: userList.listId,
                  privileges: userList.privileges as UserPrivileges[]
                }
              })
            }
          >
            {userList.list.title}
          </button>
        ))}
      </div>
      {currentList && <ItemList list={currentList.list} />}
      <SideMenu />
    </>
  );
}
