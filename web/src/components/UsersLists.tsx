import { useGetUserQuery, useGetUsersListsQuery } from '../generated/graphql';
import ItemList from './ItemList';
import { useStateValue } from 'src/state/state';
import { UserPrivileges } from 'src/types';
import ScrollingLists from './ScrollingLists';
import { openModal } from 'src/utils/dispatchActions';

export default function UsersLists() {
  const [{ currentListId }, dispatch] = useStateValue();

  const { data: userData } = useGetUserQuery({});
  const sortedListArray = userData?.getUser?.sortedListsArray;

  const { data, loading, error } = useGetUsersListsQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({}) => {
      if (currentListId === '' && usersLists[0] !== undefined) {
        const initialListId = usersLists[0].listId;
        /** Database only stores `UserPrivileges` type */
        const initialPrivileges = usersLists[0].privileges as UserPrivileges[];
        dispatch({
          type: 'SET_LIST',
          payload: { listId: initialListId, privileges: initialPrivileges }
        });
      }
    }
  });

  if (loading && !data) {
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

  /** Sort the list data based on User's sorted preferences */
  const usersLists = data.getUsersLists.userToList.map((list) => list);
  if (sortedListArray) {
    usersLists.sort((a, b) => {
      const aIndex = sortedListArray.indexOf(a.listId);
      const bIndex = sortedListArray.indexOf(b.listId);
      return aIndex - bIndex;
    });
  }

  const currentList = usersLists.find((list) => list.listId === currentListId);
  const currentSortedItems = currentList?.sortedItems;

  return (
    <div className="z-10">
      {currentList ? (
        <>
          <ScrollingLists lists={usersLists} />
          <ItemList list={currentList.list} sortedItems={currentSortedItems} />
        </>
      ) : (
        <div onClick={() => openModal(dispatch, 'createList')}>
          Add your first list!
        </div>
      )}
    </div>
  );
}
