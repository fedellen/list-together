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
import LoadingIcon from '../svg/LoadingIcon';

export const ListContext = createContext<CurrentListContext | null>(null);

export default function UsersLists() {
  const [{ currentListState }, dispatch] = useStateValue();

  const { data: userData } = useGetUserQuery({});
  const sortedListArray = userData?.getUser?.sortedListsArray;

  const { data, loading, error, refetch } = useGetUsersListsQuery({});
  const usersLists = data?.getUsersLists?.userToList?.map((list) => list);

  /** Initialize current list when data is initialized or list id is cleared */
  useEffect(() => {
    console.log('use effect is firing');
    if (usersLists) {
      if (currentListState.listId === '' && usersLists[0] !== undefined) {
        setNewList(dispatch, usersLists[0]);
      }
    }
  }, [usersLists, currentListState]);

  if (loading && !usersLists) {
    return <LoadingIcon />;
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

  const currentList = currentListState.listId
    ? usersLists.find((list) => list.listId === currentListState.listId)
    : usersLists[0];

  // const currentSortedItems = currentList?.sortedItems
  //   ? currentList.sortedItems
  //   : [];

  return (
    <div className="z-10 py-2">
      {currentList ? (
        <ListContext.Provider
          value={{
            sortedItems: currentList.sortedItems || [],
            privileges: currentList.privileges as UserPrivileges[]
          }}
        >
          <ScrollingLists lists={usersLists} />
          <ItemList
            list={currentList.list}
            sortedItems={currentList.sortedItems || []}
          />
        </ListContext.Provider>
      ) : (
        <div onClick={() => openModal(dispatch, 'createList')}>
          Add your first list!
        </div>
      )}
    </div>
  );
}
