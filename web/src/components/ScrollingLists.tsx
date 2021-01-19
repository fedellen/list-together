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
  const [, dispatch] = useStateValue();

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
    <>
      <div className="flex items-center py-4">
        <ArrowIcon direction="left" />
        <div className="overflow-x-auto whitespace-nowrap pb-4">
          {lists.map((userList) => (
            <button
              className="inline-block text-2xl font-semibold  border-r-2  border-light px-4"
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
        <ArrowIcon direction="right" />
      </div>
    </>
  );
}
