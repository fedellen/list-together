import {
  useGetUserQuery,
  useGetUsersListsQuery
} from '../../generated/graphql';
import ItemList from './ItemList';
import { useStateValue } from 'src/state/state';
import ScrollingLists from './ScrollingLists';
import { openModal, setNewList } from 'src/utils/dispatchActions';
import { createContext, useEffect } from 'react';
import { CurrentListContext, UserPrivileges } from 'src/types';
import LoadingSplash from '../styled/LoadingSplash';

export const ListContext = createContext<CurrentListContext | null>(null);

export default function UsersLists() {
  const [{ currentListId }, dispatch] = useStateValue();

  const { data: userData } = useGetUserQuery({});
  const sortedListArray = userData?.getUser?.sortedListsArray;

  const { data, loading, error, refetch } = useGetUsersListsQuery({});
  const usersLists = data?.getUsersLists?.userToList?.map((list) => list);

  /** Initialize current list when data is initialized or list id is cleared */
  useEffect(() => {
    console.log('use effect is firing');
    if (usersLists) {
      if (currentListId === '' && usersLists[0] !== undefined) {
        setNewList(dispatch, usersLists[0]);
      }
    }
  }, [usersLists, currentListId]);

  if (loading && !usersLists) {
    return <LoadingSplash />;
  } else if (!usersLists && error) {
    /** Fetch error will occur while usersLists exists during offline mode */
    const errorString = `There has been an unhandled error while loading your list data: ${error.message}`;
    console.error(errorString);
    return <div>{errorString}</div>;
  } else if (!usersLists) {
    /** List periodically fails to fetch upon login, refetch() is correcting this issue */
    refetch();
    return null;
  }

  /** Sort the list data based on User's preference */
  if (sortedListArray) {
    usersLists?.sort((a, b) => {
      return (
        sortedListArray.indexOf(a.listId) - sortedListArray.indexOf(b.listId)
      );
    });
  }

  const currentList = currentListId
    ? usersLists.find((list) => list.listId === currentListId)
    : usersLists[0];

  const strikedItems = currentList?.list.items
    ?.filter((i) => i.strike === true)
    .map((i) => i.name);

  return (
    <>
      {currentList ? (
        <ListContext.Provider
          value={{
            sortedItems: currentList.sortedItems || [],
            privileges: currentList.privileges as UserPrivileges,
            strikedItems: strikedItems || []
          }}
        >
          <ScrollingLists lists={usersLists} />
          <ItemList list={currentList.list} />
        </ListContext.Provider>
      ) : (
        <div onClick={() => openModal(dispatch, 'createList')}>
          Add your first list!
        </div>
      )}
    </>
  );
}
