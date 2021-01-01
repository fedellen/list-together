type MenuIconProps = {
  handleShowMenu: () => void;
};

export function MenuIcon({ handleShowMenu }: MenuIconProps) {
  return (
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
  );
}
