type MenuProps = {
  handleLogout: () => void;
  handleShowMenu: () => void;
};

export function Menu({ handleLogout, handleShowMenu }: MenuProps) {
  return (
    <div
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0"
      onClick={handleShowMenu}
    >
      <div className="relative w-auto my-6 mx-auto max-w-3xl bg-darker border-light border-8 rounded-lg flex flex-col p-6 gap-4 text-3xl">
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
        <button className="" onClick={handleLogout}>
          New List
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
