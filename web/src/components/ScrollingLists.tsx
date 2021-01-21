import { useState } from 'react';
import { UserToList, useUpdateListSubscription } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { UserPrivileges } from 'src/types';
import { sendNotification } from 'src/utils/dispatchActions';
import ArrowIcon from './svg/ArrowIcon';

type ScrollingListsProps = {
  lists: UserToList[];
};

export default function ScrollingLists({ lists }: ScrollingListsProps) {
  const [{ currentListId }, dispatch] = useStateValue();

  const [newData, setNewData] = useState(false);
  /** Component renders when we have the lists, use subscription */
  const listIdArray = lists.map((list) => list.listId);
  const { data, loading } = useUpdateListSubscription({
    variables: { listIdArray: listIdArray },
    fetchPolicy: 'network-only',

    onSubscriptionData: () => setNewData(true),
    onSubscriptionComplete: () =>
      console.log(
        'Connected to lists: ',
        lists.map((list) => list.list.title + ' ,')
      )
  });

  if (!loading && data && newData) {
    const notifications = data.subscribeToListUpdates.notifications;
    if (notifications) {
      sendNotification(dispatch, notifications);
    }
    console.log('New data from subscription :', data);
    setNewData(false);
  }

  return (
    <div className="flex items-center  container mx-auto pt-4">
      <div className="w-12 pb-4">
        <ArrowIcon
          direction="left"
          onClick={() => console.log('we clicked left')}
          className=""
        />
      </div>

      <ul className="overflow-x-auto whitespace-nowrap flex  ">
        {lists.map((userList) => (
          <li
            className={`text-xl  font-bold px-6 mb-4 cursor-pointer transition-all duration-500 ${
              currentListId === userList.listId &&
              'text-light underline font-extrabold'
            }`}
            key={userList.listId}
            onClick={() =>
              dispatch({
                type: 'SET_LIST',
                payload: {
                  listId: userList.listId,
                  // Postgres only saves as `UserPrivileges` type
                  privileges: userList.privileges as UserPrivileges[]
                }
              })
            }
          >
            {userList.list.title}
          </li>
        ))}
      </ul>
      <div className="w-12 pb-4">
        <ArrowIcon
          direction="right"
          onClick={() => console.log('we clicked right')}
          // className="pb-6 w-60"
        />
      </div>
    </div>
  );
}
