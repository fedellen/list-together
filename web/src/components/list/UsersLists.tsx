import {
  useGetUsersListsQuery,
  useUpdateListSubscription
} from '../../generated/graphql';
import ItemList from './ItemList';
import { useStateValue } from 'src/state/state';
import ScrollingLists from './ScrollingLists';
import { openModal, sendNotification } from 'src/utils/dispatchActions';
import { useEffect } from 'react';
import LoadingSplash from '../shared/LoadingSplash';
import { useMemo } from 'react';

type UsersListsProps = {
  /** contains sorted listId[] of all lists user has access to, if any */
  sortedListsArray: string[];
};

export default function UsersLists({ sortedListsArray }: UsersListsProps) {
  const [{ currentListId }, dispatch] = useStateValue();

  const { data, loading, error } = useGetUsersListsQuery({});
  const usersLists = data?.getUsersLists?.userToList?.map((list) => list);

  /** Initialize current list when data is initialized or list id is cleared */
  useEffect(() => {
    if (sortedListsArray.length > 0) {
      if (currentListId === '') {
        dispatch({ type: 'SET_LIST', payload: sortedListsArray[0] });
      }
    }
  }, [sortedListsArray, currentListId]);

  /** Sort the list data based on User's preference */
  const sortedLists = useMemo(
    () =>
      usersLists?.sort(
        (a, b) =>
          sortedListsArray.indexOf(a.listId) -
          sortedListsArray.indexOf(b.listId)
      ),
    [sortedListsArray, usersLists]
  );

  /** Only subscribe to list IDs that have shared users, can be empty [] */
  const listIdsToShare = sortedLists
    ? sortedLists
        .filter((userList) => userList.sharedUsers[0].shared === true)
        .map((userList) => userList.listId)
    : [];

  /** Component renders when we have the lists, use subscription */

  useUpdateListSubscription({
    variables: { listIdArray: listIdsToShare },
    onSubscriptionData: ({ subscriptionData }) => {
      const notifications =
        subscriptionData.data?.subscribeToListUpdates.notifications;
      if (notifications) {
        sendNotification(dispatch, notifications);
      }
    }
  });
  if (loading && !sortedLists) {
    return <LoadingSplash />;
  } else if (!sortedLists && error) {
    const errorString = `There has been an unhandled error while loading your list data: ${error.message}`;
    console.error(errorString);
    return <div>There has been an unhandled error: {errorString}</div>;
  }

  const currentList = sortedLists?.find(
    (list) => list.listId === currentListId
  );

  return (
    <section id="users-lists" className="content">
      {currentList && sortedLists ? (
        <>
          <ScrollingLists lists={sortedLists} />
          <ItemList
            list={currentList.list}
            sortedItems={currentList.sortedItems ? currentList.sortedItems : []}
          />
        </>
      ) : (
        <div onClick={() => openModal(dispatch, 'createList')}>
          Add your first list!
        </div>
      )}
    </section>
  );
}
