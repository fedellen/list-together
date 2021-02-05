import { useRef, useState } from 'react';
import { UserToList, useUpdateListSubscription } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { ArrowIconDirection } from 'src/types';
import { sendNotification, setNewList } from 'src/utils/dispatchActions';
import ListArrowButton from '../styled/ListArrowButton';

type ScrollingListsProps = {
  /** Pass down the main data object which has been sorted */
  lists: UserToList[];
};

export default function ScrollingLists({ lists }: ScrollingListsProps) {
  const [{ currentListId }, dispatch] = useStateValue();
  const scrollingList = useRef<HTMLUListElement>(null);
  const listIdArray = lists.map((list) => list.listId);

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

    setNewList(dispatch, nextList);
    const listNodeToScroll = scrollingList.current?.children[nextListIndex];
    listNodeToScroll?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });

    console.log(listNodeToScroll?.compareDocumentPosition);
  };

  /** State for awaiting subsciption's data to load new notifications */
  const [newData, setNewData] = useState(false);
  /** Component renders when we have the lists, use subscription */
  const { data, loading } = useUpdateListSubscription({
    variables: { listIdArray: listIdArray },
    fetchPolicy: 'network-only',
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
    <div className="grid grid-flow-col pt-4 gap-3">
      <ListArrowButton direction="left" handleArrowClick={handleArrowClick} />

      <ul
        ref={scrollingList}
        className="overflow-x-auto whitespace-nowrap flex bg-gray-200 rounded-lg px-2 shadow-md"
      >
        {lists.map((userList) => (
          <li
            className={`text-2xl  pt-4  font-semibold px-6 mb-4 cursor-pointer transition-all duration-500  border-t-4 text-gray-500  ${
              currentListId === userList.listId &&
              'text-indigo-600  border-indigo-600 font-extrabold'
            }`}
            key={userList.listId}
            onClick={() => setNewList(dispatch, userList)}
          >
            {userList.list.title}
          </li>
        ))}
      </ul>
      <ListArrowButton direction="right" handleArrowClick={handleArrowClick} />
    </div>
  );
}
