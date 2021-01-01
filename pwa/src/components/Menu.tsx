import { useApolloClient } from '@apollo/client';
import { useGetUserQuery, useLogoutUserMutation } from 'src/generated/graphql';

type MenuProps = {
  handleShowMenu: () => void;
};

export function Menu({ handleShowMenu }: MenuProps) {
  const [logout /*, { loading: logoutLoading }*/] = useLogoutUserMutation();
  const { data } = useGetUserQuery();

  const apolloClient = useApolloClient();

  const handleLogout = async () => {
    await logout();
    handleShowMenu();
    apolloClient.clearStore();
  };

  return (
    <>
      {/*items*/}
      <button className="" onClick={handleLogout}>
        New List
      </button>
      <button onClick={handleLogout}>Sort Lists</button>
      {data?.getUser && <button onClick={handleLogout}>Logout</button>}
    </>
  );
}
