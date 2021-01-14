import { UserToList, useUpdateListSubscription } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { UserPrivileges } from 'src/types';
import ArrowLeftIcon from './svg/ArrowLeftIcon';
import ArrowRightIcon from './svg/ArrowRightIcon';

type ScrollingListsProps = {
  lists: UserToList[];
};

export default function ScrollingLists({ lists }: ScrollingListsProps) {
  const [, dispatch] = useStateValue();
  /** Component renders when we have the lists, use subscription */
  const { data, loading } = useUpdateListSubscription({});

  if (data && !loading) {
    console.log('Our updated list from subscription: ', data);
  }

  return (
    <>
      <div className="flex items-center py-4">
        <ArrowLeftIcon />
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
        <ArrowRightIcon />
      </div>
    </>
  );
}
