type HeaderProps = {
  user: string;
  handleShowMenu: () => void;
};

export function Header({ user, handleShowMenu }: HeaderProps) {
  return (
    <div className="h-28 p-4 bg-darker grid grid-cols-3 gap-2 justify-items-center items-center">
      <div className="text-4xl font-extrabold">Its on the List</div>
      <div className="">{user ? `Hello ${user}!` : 'Not logged in'}</div>
      <button className="w-12" onClick={handleShowMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
