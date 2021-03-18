import { useRef } from 'react';
import { UserToList, useSortListsMutation } from 'src/generated/graphql';
import { useKeyHandler } from 'src/hooks/useKeyHandler';
import { useStateValue } from 'src/state/state';
import { ArrowIconDirection } from 'src/types';
import { arrayMove } from 'src/utils/arrayMove';
import { setNewList } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import LeftArrowIcon from '../svg/list/LeftArrowIcon';
import RightArrowIcon from '../svg/list/RightArrowIcon';

type ScrollingListsProps = {
  /** Pass down the main data object which HAS been sorted */
  lists: UserToList[];
};

export default function ScrollingLists({ lists }: ScrollingListsProps) {
  const [{ currentListId, moveList, listState }, dispatch] = useStateValue();
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
    /** Don't run if in modal (Keyboard usage) */
    if (listState[0] === 'modal') return;

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
        errorNotification(data.sortLists.errors, dispatch);
      } else {
        dispatch({
          type: 'ADD_TO_UNDO',
          payload: ['sortLists', { previousListArray: sortedListIdArray }]
        });
        scrollContainerToChildList(moveToIndex);
      }
    } catch (err) {
      console.error(`Error on sortLists mutation: ${err}`);
    }
  };

  useKeyHandler([
    { keyValues: ['ArrowLeft'], callback: () => handleArrowClick('left') },
    { keyValues: ['ArrowRight'], callback: () => handleArrowClick('right') }
  ]);

  const moreThanOneList = lists.length > 1;
  return (
    <div className="scrolling-lists">
      {moreThanOneList && (
        <button
          className="list-arrow-button"
          aria-label="Display Previous List"
          onClick={() => handleArrowClick('left')}
        >
          <LeftArrowIcon />
        </button>
      )}

      <ul ref={scrollingList}>
        {lists.map((userList) => (
          <li key={userList.listId}>
            {moveList && currentListId === userList.listId && (
              <button
                className="move-list-button"
                aria-label="Sort List to the Left"
                onClick={() => handleSortList('left')}
              >
                <LeftArrowIcon />
              </button>
            )}
            <button
              onClick={() => setNewList(dispatch, userList)}
              aria-label={`Display List: ${userList.list.title}`}
              className={` list-button ${
                currentListId === userList.listId ? ' active' : ''
              }`}
            >
              <span>{userList.list.title}</span>
            </button>
            {moveList && currentListId === userList.listId && (
              <button
                className="move-list-button"
                aria-label="Sort List to the Right"
                onClick={() => handleSortList('right')}
              >
                <RightArrowIcon />
              </button>
            )}
          </li>
        ))}
      </ul>
      {moreThanOneList && (
        <button
          className="list-arrow-button"
          aria-label="Display Next List"
          onClick={() => handleArrowClick('right')}
        >
          <RightArrowIcon />
        </button>
      )}
    </div>
  );
}
