import { useRef, useState } from 'react';
import {
  UserToList,
  useSortListsMutation,
  useUpdateListSubscription
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { ArrowIconDirection } from 'src/types';
import { arrayMove } from 'src/utils/arrayMove';
import { sendNotification, setNewList } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import LeftArrowIcon from '../svg/list/LeftArrowIcon';
import RightArrowIcon from '../svg/list/RightArrowIcon';

type ScrollingListsProps = {
  /** Pass down the main data object which HAS been sorted */
  lists: UserToList[];
};

export default function ScrollingLists({ lists }: ScrollingListsProps) {
  const [{ currentListId, moveList }, dispatch] = useStateValue();
  const scrollingList = useRef<HTMLUListElement>(null);
  const listIdArray = lists.map((list) => list.listId);

  const scrollContainerToChildList = (index: number) => {
    scrollingList.current?.children[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  };

  const handleArrowClick = (direction: ArrowIconDirection) => {
    const currentIdIndex = listIdArray.indexOf(currentListId);

    let nextListIndex: number;
    if (direction === 'right') {
      nextListIndex =
        currentIdIndex < listIdArray.length - 1 ? currentIdIndex + 1 : 0;
    } else {
      nextListIndex =
        currentIdIndex === 0 ? listIdArray.length - 1 : currentIdIndex - 1;
    }
    const nextList = lists[nextListIndex];

    scrollContainerToChildList(nextListIndex);
    setNewList(dispatch, nextList);
  };

  const [sortLists] = useSortListsMutation();
  const handleSortList = async (direction: 'left' | 'right') => {
    const sortedListIdArray = lists.map((list) => list.listId);
    const currentIndex = sortedListIdArray.indexOf(currentListId);

    const delta = direction === 'left' ? -1 : 1;

    let moveToIndex = currentIndex + delta;
    if (moveToIndex === -1) moveToIndex = sortedListIdArray.length - 1;
    if (moveToIndex === sortedListIdArray.length) moveToIndex = 0;

    const newSortedListIdArray = arrayMove(
      sortedListIdArray,
      currentIndex,
      moveToIndex
    );

    try {
      /** Use `sortLists` mutation */
      const { data } = await sortLists({
        variables: {
          data: {
            stringArray: newSortedListIdArray
          }
        }
      });
      if (data?.sortLists.errors) {
        errorNotifaction(data.sortLists.errors, dispatch);
      } else {
        scrollContainerToChildList(moveToIndex);
      }
    } catch (err) {
      console.error(`Error on sortItem mutation: ${err}`);
    }
  };

  /** State for awaiting subsciption's data to load any new notifications */
  const [newData, setNewData] = useState(false);
  /** Only subscribe to list IDs that have shared users, can be empty [] */
  const listIdsToShare = lists
    .filter((userList) => userList.sharedUsers[0].shared === true)
    .map((userList) => userList.listId);

  /** Component renders when we have the lists, use subscription */
  const { data, loading } = useUpdateListSubscription({
    variables: { listIdArray: listIdsToShare },
    onSubscriptionData: () => setNewData(true)
  });
  if (!loading && data && newData) {
    const notifications = data.subscribeToListUpdates.notifications;
    if (notifications) {
      sendNotification(dispatch, notifications);
    }
    setNewData(false);
  }

  return (
    <div className="scrolling-lists">
      <button
        className="list-arrow-button"
        onClick={() => handleArrowClick('left')}
      >
        <LeftArrowIcon />
      </button>

      <ul ref={scrollingList}>
        {lists.map((userList) => (
          <li key={userList.listId}>
            {moveList && currentListId === userList.listId && (
              <button
                className="move-list-button"
                onClick={() => handleSortList('left')}
              >
                <LeftArrowIcon />
              </button>
            )}
            <button
              onClick={() => setNewList(dispatch, userList)}
              className={`list-button${
                currentListId === userList.listId ? ' active' : ''
              }`}
            >
              <span>{userList.list.title}</span>
            </button>
            {moveList && currentListId === userList.listId && (
              <button
                className="move-list-button"
                onClick={() => handleSortList('right')}
              >
                <RightArrowIcon />
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        className="list-arrow-button"
        onClick={() => handleArrowClick('right')}
      >
        <RightArrowIcon />
      </button>
    </div>
  );
}
