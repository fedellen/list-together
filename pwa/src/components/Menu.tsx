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
    // setUser(''); state may need updating
    await logout();
    handleShowMenu();
    apolloClient.clearStore();
  };

  // const createNewList

  return (
    <>
      <div
        className="bg-darker opacity-70  overflow-x-hidden overflow-y-auto fixed z-10 inset-0"
        onClick={handleShowMenu}
      />
      <div className="justify-center items-center flex inset-0 absolute">
        <div className="relative w-auto my-6 mx-auto max-w-3xl bg-darker border-light border-8 rounded-lg flex flex-col p-6 gap-4 text-3xl z-20">
          {/*header*/}
          <div className="flex items-start justify-between pb-4 border-b-2 border-light border-gray-300 rounded-t">
            <h3 className="text-3xl font-semibold">Menu</h3>
            <button
              className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={handleShowMenu}
            >
              <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none text-lighter">
                x
              </span>
            </button>
          </div>

          {/*items*/}
          <button className="" onClick={handleLogout}>
            New List
          </button>
          <button onClick={handleLogout}>Sort Lists</button>
          {data?.getUser && <button onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </>
  );
}
