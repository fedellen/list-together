import { useGetUsersListsQuery } from 'src/generated/graphql';
import { ItemList } from './ItemList';

export function UsersLists() {
  const { data, loading, error } = useGetUsersListsQuery({});
  console.log('enter the list');

  if (loading) {
    return <div>Loading lists..</div>;
  } else if (error) {
    return <div>There was an error loading your lists: {error.message}</div>;
  } else if (!data) {
    return <div>Could not find any lists for that user..</div>;
  }

  console.log('exit the list :', data);
  return (
    <>
      {/* <button onClick={() => refetch()}>refetch</button> */}
      {data.getUsersLists.userToList?.map((userList) => (
        <div key={userList.listId}>
          <div>{userList.list.title}</div>
          <ItemList list={userList.list} />
        </div>
      ))}
    </>
  );
}
