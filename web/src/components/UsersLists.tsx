import { useGetUserQuery, useGetUsersListsQuery } from '../generated/graphql';
import ItemList from './ItemList';
import { useStateValue } from 'src/state/state';
import { UserPrivileges } from 'src/types';
import ScrollingLists from './ScrollingLists';

export default function UsersLists() {
  const [{ currentListId }, dispatch] = useStateValue();

  /** Todo: refactor handling nulled sorted arrays to backend */
  const { data: userData } = useGetUserQuery({ skip: true });
  const sortedListArray = userData?.getUser?.sortedListsArray;

  const { data, loading, error } = useGetUsersListsQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({}) => {
      if (currentListId === '') {
        const initialListId = sortedLists[0].listId;
        /** Database only stores `UserPrivileges` type */
        const initialPrivileges = sortedLists[0].privileges as UserPrivileges[];
        dispatch({
          type: 'SET_LIST',
          payload: { listId: initialListId, privileges: initialPrivileges }
        });
      }
    }
  });

  if (loading) {
    return <div>Loading lists..</div>;
  } else if (!data && error) {
    /** Fetch error can occur while data exists during offline mode */
    return (
      <div>
        There was an error loading your lists:
        {error.message}
      </div>
    );
  } else if (!data || !data.getUsersLists.userToList)
    return <div>Could not find any lists for that user..</div>;

  /** Sort the list data based on User's preferences */
  const sortedLists = data.getUsersLists.userToList;
  if (sortedListArray) {
    /** This code remains untested for now */
    sortedLists.sort((a, b) => {
      if (sortedListArray.includes(a.listId)) return -1;
      if (sortedListArray.includes(b.listId)) return 1;
      else return 0;
    });
  }

  const currentList = sortedLists.find((list) => list.listId === currentListId);

  return (
    <>
      <ScrollingLists lists={sortedLists} />
      {currentList && <ItemList list={currentList.list} />}
    </>
  );
}
