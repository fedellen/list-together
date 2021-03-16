import {
  useGetUsersListsQuery,
  useUpdateListSubscription
} from '../../generated/graphql';
import ItemList from './ItemList';
import { useStateValue } from 'src/state/state';
import ScrollingLists from './ScrollingLists';
import { openModal, sendNotification } from 'src/utils/dispatchActions';
import { useEffect, useState } from 'react';
import LoadingSplash from '../shared/LoadingSplash';
import { useMemo } from 'react';

type UsersListsProps = {
  /** contains sorted listId[] of all lists user has access to, if any */
  sortedListsArray: string[];
};

/**
 * UsersLists retrieves all of the user's lists and subscribes
 * the user to notifications and shared list updates
 *
 * - Runs `useGetUsersListsQuery` (List data entry point)
 * - Runs `useUpdateListSubscription` (App's only subscription)
 *
 *
 * - Passes the current list to => `ItemList`
 * - Passes all available lists to => `ScrollingLists`
 */
export default function UsersLists({ sortedListsArray }: UsersListsProps) {
  const [{ currentListId }, dispatch] = useStateValue();

  const { data, loading, error, refetch } = useGetUsersListsQuery({});
  const usersLists = data?.getUsersLists?.userToList?.map((list) => list);

  const [initialLoad, setInitialLoad] = useState(true);

  /** Get new lists on initial mount when persisting cache */
  useEffect(() => {
    refetch();
    setTimeout(() => {
      /** Always show LoadingSplash for first half second */
      setInitialLoad(false);
    }, 500);
  }, []);

  /** Initialize current list when data is initialized or list id is cleared */
  useEffect(() => {
    if (sortedListsArray.length > 0) {
      if (currentListId === '') {
        dispatch({ type: 'SET_LIST', payload: sortedListsArray[0] });
      }
    }
  }, [sortedListsArray, currentListId]);

  /** Sorted list data based on User's preference */
  const sortedLists = useMemo(
    () =>
      usersLists?.sort(
        (a, b) =>
          sortedListsArray.indexOf(a.listId) -
          sortedListsArray.indexOf(b.listId)
      ),
    [sortedListsArray, usersLists]
  );

  /** Only subscribe to list IDs that have shared users, can be an empty array */
  const listIdsToShare = sortedLists
    ? sortedLists
        .filter((userList) => userList.sharedUsers[0].shared === true)
        .map((userList) => userList.listId)
    : [];

  /** Connect for notifications and updates to shared lists */
  useUpdateListSubscription({
    variables: { listIdArray: listIdsToShare },
    onSubscriptionData: ({ subscriptionData }) => {
      const notifications =
        subscriptionData.data?.subscribeToListUpdates.notifications;
      if (notifications) {
        if (notifications[0].includes('You have a newly shared list')) {
          /** Refetch all lists when new list is shared */
          refetch();
        }
        sendNotification(dispatch, notifications);
      }
    }
  });

  if ((loading && !sortedLists) || initialLoad) {
    return <LoadingSplash />;
  } else if (!sortedLists && error) {
    const errorString = `Unhandled error while loading list data in "UsersLists" component: ${error.message}`;
    console.error(errorString);
    return (
      <div>
        Major error has occurred, please report this as a bug: {errorString}
      </div>
    );
  }

  /** Currently displayed list */
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
        <div id="empty-list" onClick={() => openModal(dispatch, 'createList')}>
          Add your first list!
        </div>
      )}
    </section>
  );
}
